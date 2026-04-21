import os
from cryptography.fernet import Fernet
from typing import Optional

# Load the master security key from environment
MASTER_KEY = os.getenv("MASTER_SECURITY_KEY")

if MASTER_KEY:
    # Ensure the key is valid bytes
    fernet = Fernet(MASTER_KEY.encode())
else:
    fernet = None
    print("WARNING: MASTER_SECURITY_KEY not found in environment. Data-at-rest encryption disabled.")


class EncryptionService:
    @staticmethod
    def encrypt(data: str) -> Optional[str]:
        """Encrypts a string into a URL-safe base64-encoded string."""
        if not fernet or not data:
            return data
        
        try:
            encrypted_data = fernet.encrypt(data.encode())
            return encrypted_data.decode()
        except Exception as e:
            print(f"Encryption error: {e}")
            return None

    @staticmethod
    def decrypt(encrypted_data: str) -> Optional[str]:
        """Decrypts an encrypted string back to plain text."""
        if not fernet or not encrypted_data:
            return encrypted_data
            
        try:
            decrypted_data = fernet.decrypt(encrypted_data.encode())
            return decrypted_data.decode()
        except Exception as e:
            # If decryption fails (e.g., wrong key or corrupted), return None
            print(f"Decryption error: {e}")
            return None


# Singleton instance
encryption_service = EncryptionService()
