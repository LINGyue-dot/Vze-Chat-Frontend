export const UPLOAD_API = "http://175.24.185.110:5200";
// export const UPLOAD_API = "http://localhost:5200";
//

// export const BASE_API = "http://localhost:3100";
// export const SOCKETIO_API = "http://localhost:3100";
// export const WS_API = "ws://localhost:7000";

//"http://175.24.185.110:3100"
// process.env.VUE_APP_BASE_URL
export const BASE_API = process.env.VUE_APP_BASE_URL as string;
export const SOCKETIO_API = process.env.VUE_APP_BASE_URL as string;
export const WS_API = process.env.VUE_APP_BASE_URL as string;
//
