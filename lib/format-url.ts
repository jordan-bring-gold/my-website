export const formatUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    } 
    // if the url string is empty, return an empty string
    else if (url === "") {
      return "";
    }
    return url;
  };