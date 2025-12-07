let ENV = {};

async function loadEnv() {
    const res = await fetch(".env");
    const text = await res.text();

    text.split("\n").forEach(line => {
        if (!line || line.startsWith("#")) return;
        const [key, value] = line.split("=");
        ENV[key.trim()] = value.trim();
    });

    return ENV;
}
