const fs = require('fs');
const path = require('path');

const argv2 = process.argv[2]; //스크립트 적용할 폴더 이름
const dirname = `./${argv2}`; //스크립트 적용할 폴더

function moveFile(file, folder) {
  //파일을 다른 폴더로 이동하는 함수
  fs.renameSync(
    path.join(__dirname, argv2, file),
    path.join(__dirname, argv2, folder, file),
    (error) => {
      console.log(error);
    }
  );
  console.log(`move ${file} to ${folder}`);
}

//전체 파일을 탐색하며 분류
fs.readdir(dirname, function (error, filelist) {
  const files = filelist;
  files.forEach((file) => {
    const extName = path.extname(file); //확장자명

    if (extName === '.mp4' || extName === '.mov') {
      //동영상 파일 분류
      const newDir = 'video';
      if (!fs.existsSync(`./${argv2}/${newDir}`))
        fs.mkdirSync(`./${argv2}/${newDir}`); //video 폴더가 없다면 video 폴더 생성
      moveFile(file, newDir);
    } else if (extName === '.jpg' || extName === '.JPG') {
      //보정된 사진의 원본 분류
      if (file.indexOf('_M') > 0) {
        const newDir = 'duplicated';
        if (!fs.existsSync(`./${argv2}/${newDir}`))
          fs.mkdirSync(`./${argv2}/${newDir}`); //duplicated 폴더가 없다면 생성

        //보정된 사진의 원본 사진 찾기
        const id = file.slice(5, file.length - extName.length); //사진의 고유 번호 추출 (IMG_M이후의 숫자)
        files.forEach((photo) => {
          //고유번호를 가진 원본 사진 찾아서 폴더 이동
          if (photo.includes(id) && !photo.includes('_M')) {
            moveFile(photo, newDir);
          }
        });
      }
    } else if (extName === '.aae' || extName === '.png' || extName === '.PNG') {
      //캡쳐한 사진 분류
      const newDir = 'captured';
      if (!fs.existsSync(`./${argv2}/${newDir}`))
        //png 폴더가 없다면 생성
        fs.mkdirSync(`./${argv2}/${newDir}`);
      moveFile(file, newDir);
    }
  });
});
