const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

// Configure the AWS SDK
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT, // Using the R2 endpoint from the environment variables
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  signatureVersion: "v4",
});

const bucketName = "edgi-take1"; // Replace <YOUR_BUCKET_NAME> with your bucket name

// Function to check if the file is already uploaded
async function isFileUploaded(fileName) {
  try {
    await s3.headObject({ Bucket: bucketName, Key: fileName }).promise();
    return true; // The file is already uploaded
  } catch (err) {
    if (err.code === "NotFound") {
      return false; // The file is not uploaded
    }
    throw err; // An error other than Not Found occurred
  }
}

function getContentType(file) {
  const fileExtension = path.extname(file).toLowerCase();
  if (fileExtension === ".mp4") return "video/mp4";
  if (fileExtension === ".jpg") return "image/jpeg";
  return null;
}

async function uploadFile(folderPath, file, index, count) {
  const filePath = path.join(folderPath, file);
  const fileName = path.basename(filePath);

  if (await isFileUploaded(file)) {
    console.log(`exists:   ${file} (${index}/${count})`);
    return;
  }

  const params = {
    Bucket: bucketName,
    Key: fileName, // File name you want to save as in R2
    Body: fs.readFileSync(filePath),
    ContentType: getContentType(file),
  };

  await s3.upload(params).promise();
  console.log(`uploaded: ${fileName} (${index}/${count})`);
}

const dataDir = "./data";

// Function to iterate through subfolders and upload files
async function uploadFromSubfolders() {
  const folders = await fs.promises.readdir(dataDir);
  for (const folder of folders) {
    const folderStat = await fs.promises.stat(path.join(dataDir, folder));
    if (!folderStat.isDirectory()) {
      continue;
    }
    const folderPath = path.join(dataDir, folder);
    const files = (await fs.promises.readdir(folderPath)).filter((file) => {
      return file.endsWith(".jpg") || file.endsWith(".mp4");
    });

    for (const [i, file] of files.entries()) {
      // for every tenth one, wait until it uploads so we don't load everything all at once
      if (i % 10 === 0) {
        await uploadFile(folderPath, file, i + 1, files.length);
      } else {
        uploadFile(folderPath, file, i + 1, files.length);
      }
    }
  }
}

uploadFromSubfolders();
