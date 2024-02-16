import { NextResponse } from 'next/server';
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

AWS.config.update({
  region: process.env.AWS_DEFAULTREGION,
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
});

export async function POST(req: Request) {
  try {
    let { name, type } = await req.json();

    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
      ACL: 'public-read',
    };

    const url = await s3.getSignedUrlPromise('putObject', fileParams);

    NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.log('main error');
    console.log(err);
    NextResponse.json({ err }, { status: 400 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
};
