import fs from "fs";
import path from "path";


export const getNovelContent = async (filename) => {
    const dirPath = path.join(process.cwd(), "temporaryStorage", "chapterNovel");
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, filename); 
    const fread = await fs.promises.readFile(filePath)
    if(fread){
        return String(fread)
    }
    return -1
}

