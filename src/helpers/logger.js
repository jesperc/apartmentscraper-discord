export const log = (text, filePath, fs) => {
  console.log(text)
  fs.appendFileSync(filePath, text + '\n')
}
