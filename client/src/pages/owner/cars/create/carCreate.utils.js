export const buildCreateCarFormData = ({ f, location, files }) => {
  const fd = new FormData();

  Object.entries(f).forEach(([k, v]) => {
    fd.append(k, v);
  });

  fd.append("location", JSON.stringify(location));

  files.forEach((file) => {
    fd.append("images", file);
  });

  return fd;
};
