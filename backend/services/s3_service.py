import os
import aioboto3
from typing import Optional
from botocore.exceptions import ClientError

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "eu-central-1")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "locallink-assets")

session = aioboto3.Session()


class S3Service:
    @staticmethod
    async def get_upload_url(file_key: str, content_type: str) -> Optional[str]:
        """
        Generate a presigned URL to allow the frontend to upload directly to S3.
        This is more secure than proxying files through our server.
        """
        if not AWS_ACCESS_KEY:
            return None # Fallback or error

        async with session.client(
            "s3",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
        ) as s3:
            try:
                url = await s3.generate_presigned_url(
                    ClientMethod="put_object",
                    Params={
                        "Bucket": S3_BUCKET_NAME,
                        "Key": file_key,
                        "ContentType": content_type,
                    },
                    ExpiresIn=300, # 5 minutes
                )
                return url
            except ClientError as e:
                print(f"S3 Error: {e}")
                return None

    @staticmethod
    async def get_view_url(file_key: str) -> str:
        """Get the public URL for a file (or presigned if private)."""
        if not S3_BUCKET_NAME:
            return f"/local-storage/{file_key}" # Local fallback
        return f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_key}"


# Singleton instance
s3_service = S3Service()
