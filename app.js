const CONTRACT_ADDRESS = "";
const ABI = <your_abi>;

let provider, signer, contract, allNFTs = [];

document.getElementById("connectBtn").onclick = connect;

async function connect() {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        alert("Wallet connected!");

        loadNFTs();
}

async function loadNFTs() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "Loading…";

    let items = [];
    const total = Number(await contract.nextId());

    for (let id = 1; id < total; id++) {
        try {
            const grad = await contract.graduates(id);
            const url = grad.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/");

            const metadata = await fetch(url).then(r => r.json());

            items.push({
                tokenId: id,
                name: grad.name,
                program: grad.program,
                grade: grad.grade,
                metadata
            });

            } catch (err) {
                console.log("Skip token", id);
            }
    }

    allNFTs = items;
    render(items);
}

function render(list) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    list.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}">
            <h3>${item.metadata.name}</h3>
            <p class="attr"><b>Name:</b> ${item.name}</p>
            <p class="attr"><b>Program:</b> ${item.program}</p>
            <p class="attr"><b>Grade:</b> ${item.grade}</p>
        `;
                gallery.appendChild(card);
            });
        }

    document.getElementById("searchBar").oninput = function () {
        const q = this.value.toLowerCase();
        const filtered = allNFTs.filter(n =>
        n.name.toLowerCase().includes(q) ||
        n.program.toLowerCase().includes(q) ||
        n.grade.toLowerCase().includes(q)
    );
    render(filtered);
};