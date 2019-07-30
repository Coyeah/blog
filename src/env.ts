const website_env_config = process.env.NODE_ENV === 'development' ? {
  location: 'localhost:9000'
} : {
  location: 'https://wwww.coyeah.top'
};

export const env = {
  ...website_env_config,
}