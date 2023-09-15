import YouTube from "react-youtube";
import { getVideoIdFromUrl } from "../../../helpers/helper_functions";

/**
 * 
 * @param {string} link 
 */
const youtube_link_to_embed = (link) => {
  link = link.trim();
  let id = undefined;
  if (link.startsWith("https://www.youtube.com") || link.startsWith("https://youtube.com")) {
    if (link.includes("/embed/")) {
      id = link.substring(link.lastIndexOf("/") + 1, link.length);
    }
    else if (link.includes("watch?v=")) {
      const start = link.indexOf("=") + 1;
      const end = link.includes("&") ? link.indexOf("&") : link.length;
      console.log("start idx ::: ", start, "end idx ::: ", end);
      id = link.substring(start, end);
    }
  } else if (link.startsWith("https://www.youtu.be") || link.startsWith("https://youtu.be")) {
    id = link.substring(link.lastIndexOf("/") + 1, link.length);
  }
  // abort drawing if id not found
  if (!id) return undefined;
  console.log("youtube id :: ", id);
  return `https://www.youtube.com/embed/${id}?autoplay=1`;
};

const YoutubePlayer = ({ videoLink }) => {
  console.log("from youtube :: ", videoLink);
  const videoId = youtube_link_to_embed(videoLink);
  // const videoId = getVideoIdFromUrl(videoLink);
  console.log("after transform :: ", videoId);

  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  };

  // const opts = {
  //   height: "390",
  //   width: "100%",
  //   playerVars: {
  //     // https://developers.google.com/youtube/player_parameters
  //     autoplay: 1,
  //   },
  // };


  if (videoLink) {
    return (
      <iframe className="w-full h-full rounded-md" src={videoId} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen>

      </iframe>
    );
  }

  // if (videoLink)
  //   return (
  //     <YouTube
  //       videoId={videoId}
  //       opts={opts}
  //       onReady={onPlayerReady}
  //       className="mt-8"
  //     />
  //   );
};

export default YoutubePlayer;
