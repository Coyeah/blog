export const github_config = {
  client_id: '1eeae60664b37e276392',
  client_secret: 'abbe4c4ddebec3d286675849e1aa81b9e7c6f5ee'
};

export const github_api_prefix = Object.keys(github_config).map(key => `${key}=${github_config[key]}`).join('&');