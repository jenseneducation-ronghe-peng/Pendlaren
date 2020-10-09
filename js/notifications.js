function requestNotificationPermission() {
  Notification.requestPermission().then((response) => {
    console.log(response);
  });
}

function createNotification(stationName) {
  const icon = "images/icon-apple-touch.png";
  const name = stationName;

  const notification = new Notification("New traffic", {
    body: `New traffic information: ${name}`, //`${name}: ${time}`,
    icon: icon,
  });

  notification.addEventListener("click", (event) => {
    window.open("https://localhost:443/");
  });
}

export { requestNotificationPermission, createNotification };
