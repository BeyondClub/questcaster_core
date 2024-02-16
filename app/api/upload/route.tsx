import { NextResponse } from 'next/server';
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
});

const s3 = new AWS.S3();

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

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.log('main error');
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
