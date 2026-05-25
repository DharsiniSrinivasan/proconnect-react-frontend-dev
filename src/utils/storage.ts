export const getStorage = () => {
  const keepMeSignedIn =
    JSON.parse(localStorage.getItem("keepMeSignedIn") || "false") === true;
  return keepMeSignedIn ? localStorage : sessionStorage;
};
