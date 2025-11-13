// import { useSettingsStore } from "~/store/settings";
// // eslint-disable-next-line
// // @ts-ignore
// import { useRoute } from "vue-router";
// export function connectToSocket() {
//   const route = useRoute();
//   console.log(route);
//   const { $socket } = useNuxtApp();

//   if ($socket.disconnected) {
//     $socket.connect();
//   }
//   if (!$socket.hasListeners("newMessage")) {
//     $socket.on("newMessage", (data) => {
//       console.log("test", data);
//       if (route.name === "chat") return;
//       const { new_message } = useSettingsStore();
//       const audioMessage = new Audio(new_message);
//       audioMessage.play();
//     });
//   }
//   if (!$socket.hasListeners("newOrder")) {
//     $socket.on("newOrder", () => {
//       if (route.name === "/orders") return;
//       const { new_order } = useSettingsStore();
//       const audio = new Audio(new_order);
//       audio.play();
//     });
//   }
// }

// export function disconnectFromSocket() {
//   const { $socket } = useNuxtApp();
//   if ($socket.connected) {
//     $socket.disconnect();
//   }
// }
