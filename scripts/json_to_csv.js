const fs = require("fs");
const path = require("path");
const dataDir = "./data";
const { stringify } = require("csv-stringify/sync");

function creatorHeader() {
  return stringify([["tiktok_id", "handle", "name", "bio"]]);
}
function creatorToRow(author) {
  // use stringify to convert author data into a csv row
  return stringify([
    [author.id, author.unique_id, author.name, author.signature],
  ]);
}

function parseCount(count) {
  if (typeof count === "number") return count;
  if (count.endsWith("K")) return parseInt(parseFloat(count) * 1000);
  if (count.endsWith("M")) return parseInt(parseFloat(count) * 1000000);
  if (count.endsWith("B")) return parseInt(parseFloat(count) * 1000000000);
  return count;
}

function videoHeader() {
  return stringify([
    [
      "tiktok_id",
      "creator_id",
      "filename",
      "cover_filename",
      "caption",
      "tiktok_url",
      "created_at",
      "tiktok_like_count",
      "tiktok_comment_count",
      "tiktok_share_count",
      "tiktok_play_count",
      "tiktok_save_count",
      "width",
      "height",
      "duration",
      "ratio",
    ],
  ]);
}

function videoToRow(id, creatorId, video) {
  return stringify([
    [
      id,
      creatorId,
      `${id}.mp4`,
      `${id}.jpg`,
      video.title.toLowerCase().includes("tiklydown") ? "" : video.title,
      video.url,
      new Date(video.created_at).toISOString(),
      parseCount(video.stats.likeCount),
      parseCount(video.stats.commentCount),
      parseCount(video.stats.shareCount),
      parseCount(video.stats.playCount),
      parseCount(video.stats.saveCount),
      video.video.width,
      video.video.height,
      video.video.duration,
      video.video.ratio,
    ],
  ]);
}

// Function to iterate through subfolders and upload files
async function jsonToCsvs() {
  // open a csv file to write into for creators
  const creatorsCsv = fs.createWriteStream("./data/creators.csv");
  creatorsCsv.write(creatorHeader());

  // open a csv file to write into for videos
  const videosCsv = fs.createWriteStream("./data/videos.csv");
  videosCsv.write(videoHeader());

  const folders = await fs.promises.readdir(dataDir);
  for (const folder of folders) {
    const folderStat = await fs.promises.stat(path.join(dataDir, folder));
    if (!folderStat.isDirectory()) {
      continue;
    }

    const folderPath = path.join(dataDir, folder);
    const files = (await fs.promises.readdir(folderPath)).filter((file) =>
      file.endsWith(".json")
    );

    const creatorMap = {
      astro_alexandra: "e5c750bd-3271-4760-b7c9-8b5b82ae509d",
      bigweirdworld: "0f51b40d-9562-44c5-81dc-ec34f1af222c",
      cleoabram: "a6c95e47-5e8b-47ce-bee3-baed637b0f92",
      colethesciencedude: "56b8dac2-9a03-48f0-a2ce-857d6bc0a4d3",
      "dr.noc": "b75699d6-73de-4a13-9e40-82fcdd890998",
      evanthorizon: "1f07e11c-aa9e-4a2c-88ce-c4e827f4bc0b",
      gatenerd: "edb2b99f-212f-4895-a18f-56ec4718f28f",
      kurz_gesagt: "9bde8a42-2bae-4900-a43e-17d09799a387",
      markrober: "2f35edd5-6cd0-4882-8439-09f59b14d8a4",
      nilered: "674d3649-b953-44fc-b839-7a822c0889b2",
      pinkpencilmath: "fe9604ad-f7ca-4905-893b-e94d4acd4c4a",
      planetmoney: "6c077cb7-b4fd-4c95-a048-9236b13448f1",
    };
    for (const [i, file] of files.entries()) {
      const videoId = file.split(".")[0];
      const filePath = path.join(folderPath, file);
      const videoData = JSON.parse(fs.readFileSync(filePath));
      if (i == 0) {
        creatorsCsv.write(creatorToRow(videoData.author));
      }
      videosCsv.write(
        videoToRow(videoId, creatorMap[videoData.author.unique_id], videoData)
      );
    }
  }
}

jsonToCsvs();
