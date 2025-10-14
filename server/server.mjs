import app from "./app.mjs";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servern körs på port: ${PORT}`);
});
