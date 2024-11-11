import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RedirectPage = () => {
  const router = useRouter();
  const { shortCode } = router.query; // Get the shortCode from the URL

  useEffect(() => {
    if (shortCode) {
      // Fetch the original URL from the backend based on the shortCode
      fetch(`/api/getUrl/${shortCode}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.originalUrl) {
            // Redirect to the original URL
            window.location.href = data.originalUrl;
          } else {
            console.error('No original URL found for this short code');
          }
        })
        .catch((error) => {
          console.error('Error fetching the original URL:', error);
        });
    }
  }, [shortCode]);

  return <div>Redirecting...</div>;
};

export default RedirectPage;
