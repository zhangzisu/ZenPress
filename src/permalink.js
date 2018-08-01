import config from "../zenpress.config";

function getPostPermalink(post_id) {
  return encodeURI(
    "zenpress://" +
      config["api-key"] +
      "@" +
      config["api-host"] +
      "/post/" +
      post_id
  );
}

export default getPostPermalink;
