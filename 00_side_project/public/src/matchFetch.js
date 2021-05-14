async function sendSettingInfo (data) {
    const response = await fetch("http://localhost:3000/api/1.0/match", {
        body: JSON.stringify(data),
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });
    return await response.json();
}

export { sendSettingInfo };
