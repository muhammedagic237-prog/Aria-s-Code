const ffmpegPath = require('ffmpeg-static');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const reelsDir = path.join(__dirname, 'public', 'reels');
const thumbDir = path.join(reelsDir, 'thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

const files = fs.readdirSync(reelsDir).filter(f => f.endsWith('.mov') && !f.startsWith('compressed_'));

for (const file of files) {
  const inputPath = path.join(reelsDir, file);
  const outputPath = path.join(reelsDir, 'compressed_' + file);
  const thumbPath = path.join(thumbDir, file.replace('.mov', '.webp'));
  
  console.log(`\n\n[Processing ${file}]...`);

  // 1. Generate Static Thumbnail (first frame)
  console.log(`- Generating thumbnail: ${path.basename(thumbPath)}`);
  spawnSync(ffmpegPath, [
    '-y',
    '-i', inputPath,
    '-ss', '00:00:01', // Get frame at 1 second mark for better thumbnail
    '-frames:v', '1',
    '-q:v', '2',
    thumbPath
  ], { stdio: 'inherit' });
  
  // 2. Compress Video
  console.log(`- Compressing video...`);
  // Downscale to 720p maximum, 30fps, lower quality to assure it drops under 100MB
  const args = [
    '-y',
    '-i', inputPath,
    '-vf', 'scale=-2:720',
    '-r', '30',
    '-vcodec', 'libx264',
    '-crf', '30', 
    '-preset', 'fast',
    outputPath
  ];
  
  const result = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
  
  if (result.error || result.status !== 0) {
    console.error(`Failed to compress ${file}`);
    continue;
  }
  
  console.log(`[Success] Processed ${file}`);
  
  // Overwrite original with compressed version
  fs.copyFileSync(outputPath, inputPath);
  fs.unlinkSync(outputPath);
}

console.log('\nAll done processing videos and thumbnails!');
