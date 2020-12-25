/**
 * Library for processing data
 */

const fs =require('fs');
const path = require('path');

//  Data processing container
const lib = {}; 

lib.baseDir = path.join(__dirname, '../.data/');

lib.create = (dir, filename, data, cb) => {
    // open file
    fs.open(`${lib.baseDir}${dir}/${filename}.json`, 'wx', (err, fd) => {
        if (!err && fd) {
            const dataStr = JSON.stringify(data);

            fs.writeFile(fd, dataStr, (err) => {
                if (err) {
                    cb('Error writing new file');
                } else {
                    fs.close(fd, (err) => {
                        if (err) {
                            cb('Error closing file');
                        } else {
                            cb(null);
                        }
                    })
                }
            })
        } else {
            cb('File already exist');
        }
    })
}

lib.read = (dir, filename, cb) => {
    // Read File
    fs.readFile(`${lib.baseDir}${dir}/${filename}.json`, 'utf8', (err, data) => {
        if (err) {
            cb (err);
        } else {
            cb(null, data);
        }
    })
}

lib.update = (dir, filename, data, cb) => {
    fs.open(`${lib.baseDir}${dir}/${filename}.json`, 'r+', (err, fd) => {
        if (!err && fd) {
            const dataStr = JSON.stringify(data);

            fs.truncate(`${lib.baseDir}${dir}/${filename}.json`, (err) => {
                if (err) {
                    cb(err, 'Error truncate file');
                } else {
                    fs.writeFile(fd, dataStr, (err) => {
                        if (err) {
                            cb('Error writing to existing file');
                        } else {
                            fs.close(fd, (err) => {
                                if (err) {
                                    cb('Error closing file');
                                } else {
                                    cb(null);
                                }
                            })
                        }
                    })
                }
            })
        } else {
            cb('File Couldnt be open or it may not exist')
        }
    })
}

lib.delete = (dir, filename, cb) => {
    // use unlink to remove file from file system
    fs.unlink(`${lib.baseDir}${dir}/${filename}.json`, (err) => {
        if (err) {
            cb('Error deleting file');
        } else {
            cb(null);
        }
    })
}

module.exports = lib;
 