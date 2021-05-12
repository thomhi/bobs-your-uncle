import io from "socket.io-client";
import { localStorageService } from "../businessLogic/LocalStroageService";

export const socket = io.connect("http://localhost:5555", {
  transports: ['websocket'],
  query: `token=${localStorageService.getJWT()}`
});