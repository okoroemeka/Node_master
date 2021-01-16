/**
 * LIbrary for storing data and editing data
 *
 */

//  Dependencies

const fs = require('fs');
const path = require('path');

// Container for the module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
  //Open the file for writing
  fs.open(
    lib.baseDir + dir + '/' + file + '.json',
    'wx',
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //Convert data to string
        const stringData = JSON.stringify(data);

        //Write to file and close
        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing new file');
              }
            });
          } else {
            callback('Error writing to new file');
          }
        });
      } else {
        callback('Could not create new file, it may already exist');
      }
    }
  );
};

//Read data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
    callback(err, data);
  });
};

//Update data in the file

lib.update = (dir, file, data, callback) => {
  //Open the file for writing
  fs.open(
    lib.baseDir + dir + '/' + file + '.json',
    'r+',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        //Convert data to string
        const stringData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback('Error closing this file');
                  }
                });
              } else {
                callback('err writing to this file');
              }
            });
          } else {
            callback('Err truncating file');
          }
        });
      } else {
        callback('Could not open this file for updating, it may not exist yet');
      }
    }
  );
};

//Deleting a file

lib.delete = (dir, file, callback) => {
  //Unlink the file
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('error occured while unlinking the file');
    }
  });
};

module.exports = lib;
