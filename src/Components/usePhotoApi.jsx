
import axios from 'axios';
import { useState } from 'react';

import { Buffer } from 'buffer';
const usePhotoApi = () => {

const fetchAvatar = async function (username){
  const response = await axios(`https://api.multiavatar.com/${username?username:'Binx Bond'}.png`,{
    responseType:'arraybuffer'
  });
  let base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
  let srcValue = "data:image/png;base64,"+base64ImageString;
  return srcValue;
  }
  
  return { fetchAvatar }
 
}

export default usePhotoApi
