import * as AWS from 'aws-sdk';

export default class ImportService {
    private bucketName = process.env['BUCKET_NAME'];

    private s3 = new AWS.S3({ region: 'eu-central-1' });


     createSignedUrl(filename: string): string {

        try{
            const signedUrl =  this.s3.getSignedUrl('putObject', {
                Bucket: this.bucketName,
                Key: `uploaded/${filename}`,
                Expires: 60,
                ContentType: 'text/csv',
            });

            console.log('SignedUrl:', signedUrl);

            return signedUrl;
        } catch (e) {
            console.log('Error', e)
            return '';
        }
    }
}