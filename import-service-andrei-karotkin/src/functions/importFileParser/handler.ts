import { middyfy } from '@libs/lambda';
import csv from 'csv-parser';

import {  S3Event} from "aws-lambda";
import * as AWS from 'aws-sdk';

const importFileParserHandler = async (event: S3Event): Promise<void> => {
  console.log('Incoming Event', event);
  try {
      const s3 = new AWS.S3({ region: 'eu-central-1' });
      const bucketName = process.env['BUCKET_NAME'];

      let parsedData = [];
      for (const record of event.Records) {
          const key = record.s3.object.key;

          const s3Stream = s3
              .getObject({
                  Bucket: bucketName,
                  Key: key,
              })
              .createReadStream();
          await new Promise((resolve, reject) => {

              s3Stream
                  .pipe(csv())
                  .on('data', (data) => {
                      console.log('Parsed Data:', data);
                      parsedData = [...parsedData, data];
                  })
                  .on('error', (error) => {
                      console.log('Error', error);
                      reject('ERROR: ' + error);
                  })
                  .on('end', async () => {

                      await s3
                          .copyObject({
                              Bucket: bucketName,
                              CopySource: `${bucketName}/${key}`,
                              Key: key.replace('uploaded', 'parsed'),
                          })
                          .promise();


                      await s3
                          .deleteObject({
                              Bucket: bucketName,
                              Key: key,
                          })
                          .promise();


                      console.log('Parsed Data', parsedData);
                      resolve(parsedData);
                  });
          });
      }
  } catch (e) {
    console.log('Error',e)
  }
};

export const importFileParser = middyfy(importFileParserHandler);
