

import Gallery from "@/components/ImagesGallery";
import { getImages } from "../actions/getImages";


const page = async () => {
  const images = await getImages()

  return (
 <Gallery images={images}/>
  );
};

export default page;