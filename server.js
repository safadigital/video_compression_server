// import express from "express";
// import multer from "multer";
// import ffmpeg from "fluent-ffmpeg";
// import path from "path";
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;

const timeout = require('connect-timeout');

// function to de;ete a;; fi;es inside directory
async function removeRecursively(directory) {
  await fs.rmdir(directory, { recursive: true });
}

// Call the function
// removeRecursively('path/to/directory')
//   .then(() => console.log('Directory and all its contents have been removed recursively.'))
//   .catch(console.error);


const app = express();
app.use(timeout('500s'));
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('video'), (req, res) => {

// const __filename = fileURLToPath(req.file.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory


  const videoPath = req.file.path;
  const outputFilePath = `compressed_${req.file.originalname}`;
  // Call the compression function here
  compressVideo(videoPath, outputFilePath, res);
});
const compressVideo = (inputPath, outputPath, res) => {
  ffmpeg(inputPath)
    .output(path.join(__dirname, 'uploads', outputPath))
    .videoCodec('libx264')
    .size('30%')
    .on('end', () => {
      console.log('Compression completed!');
      console.log("INput path: ", inputPath);
      console.log("OUTPUT path: ", outputPath);
      console.log("Local folder path: ", process.cwd());
     const inputFile = path.join(process.cwd(), `./${inputPath}`);
     const outputFile = path.join(process.cwd(), `./uploads/${outputPath}`);

     console.log("OUTPUT FILE: ", outputFile);
     console.log("INPUT FILE: ", inputFile);

     // send file to client





    //  res.send('Video uploaded and compressed successfully!');
     // return comporessed file to client
      return res.status(200).sendFile(outputFile, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', outputFile);
            // then remove al files 
            // Remove input file
fs.unlink(inputFile, (err) => {
  if (err) {
    console.error(`Error removing file: ${err}`);
    return;
  }

  console.log(`File ${inputFile} has been successfully removed.`);
});

// Remove the output file
fs.unlink(outputFile, (err) => {
  if (err) {
    console.error(`Error removing file: ${err}`);
    return;
  }

  console.log(`File ${outputFile} has been successfully removed.`);
});
        }
      });


    })
    .on('error', (err) => {
      console.error('Compression failed:', err);
      res.status(500).send('Compression failed.');
    })
    .run();
};
const PORT = process.env.PORT || 4444;
let server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// server.setTimeout(5000000);