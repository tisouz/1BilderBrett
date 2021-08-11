export const setBulmaButtonClasses  = (isLoading: boolean) => {
  const classes: string[] = [];
 if(isLoading === true) 
   classes.push("is-loading");
 
  return ("button " + classes.join(' '));
}

export const getAuthorizationHeader = (accessToken: string) => {
  const authToken = "Bearer " + accessToken;
  return {
      headers: {
          'Authorization': authToken
      }
  }
}