async function afficherClient() {
    try {
        // ⚡ Charger les données JSON depuis tableau.json
        const reponse = await fetch("tableau.json");
        const tabJson = await reponse.json();

        // 🔹 Sauvegarder les données dans le localStorage
        localStorage.setItem("tabJson", JSON.stringify(tabJson));

        // 📌 Vérifier si les données existent dans le localStorage
        const donneStock = localStorage.getItem("tabJson");
        if (!donneStock) {
            console.log("Aucune donnée trouvée !");
            return;
        }

        const clients = JSON.parse(donneStock).client;
        console.log("Données récupérées :", clients);

        let index = 0; // Index du client affiché
        let client = clients[index];

        function afficherDetails(client) {
            document.getElementById("photoProfil").innerHTML = `
                <img src="${client.photo}" alt="Photo de ${client.nom}" class="w-32 h-32 rounded-full">
            `;
            document.getElementById("nomClient").innerText = `Bonjour ${client.prenom} ${client.nom} 😍`;
            document.getElementById("telClient").innerText = `Téléphone: ${client.telephone}`;
            document.getElementById("mailClient").innerText = `Email: ${client.email}`;
            document.getElementById("soldeClient").innerText = `Montant: ${client.montant} FCFA`;

            // 🏦 Afficher la liste des transactions
            let transactionHTML = "";
            client.transactions.forEach(tr => {
                transactionHTML += `
                    <tr class="odd:bg-white even:bg-slate-100 cursor-pointer hover:bg-slate-200">
                        <td class="p-2">${tr.date}</td>
                        <td class="p-2">${tr.numero}</td>
                        <td class="p-2">${tr.type}</td>
                        <td class="p-2 font-semibold ${tr.montant < 0 ? 'text-red-500' : 'text-green-500'}">
                            ${tr.montant} €
                        </td>
                    </tr>
                `;
            });
            document.getElementById("transactionsTable").innerHTML = transactionHTML;
        }

        // Afficher le premier client au chargement
        afficherDetails(client);

        // 🔘 Bouton précédent
        document.getElementById("precedent").addEventListener("click", () => {
            if (index > 0) {
                index--;
                afficherDetails(clients[index]);
            }
        });

        // 🔘 Bouton suivant
        document.getElementById("suivant").addEventListener("click", () => {
            if (index < clients.length - 1) {
                index++;
                afficherDetails(clients[index]);
            }
        });

        // Fonction pour afficher le formulaire d'ajout de client
        function ajout_client() {
            let ajoutClient = document.createElement("div");
            let divMere = document.getElementById("mere");

            ajoutClient.className = "order-1 col-span-3 grid grid-cols-1 gap-1 bg-white rounded-xl shadow-lg max-h-[650px]";
            ajoutClient.innerHTML = `
                <form method="POST" id="formClient" class="w-full grid grid-cols-1 gap-1 p-3">
                    <button type="button" id="closeBtn" class="place-self-end text-start text-2xl text-slate-700">
                        <i class="ri-close-circle-line"></i>
                    </button> 
                    <p class="text-2xl font-semibold text-center mt-4">Ajouter un(e) client(e)</p>
                    <div>
                        <label for="image" class="block text-gray-700 m-2">Insérez une photo</label>
                        <input type="file" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="image" id="image">
                    </div>
                    <div>
                        <label for="nom" class="block text-gray-700 m-2">Nom</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="nom" id="nom">
                    </div>
                    <div>
                        <label for="prenom" class="block text-gray-700 m-2">Prénom</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="prenom" id="prenom">
                    </div>
                    <div>
                        <label for="mail" class="block text-gray-700 m-2">Email</label>
                        <input type="email" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="mail" id="mail">
                    </div>
                    <div>
                        <label for="solde" class="block text-gray-700 m-2">Montant</label>
                        <input type="number" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="montant" id="montant">
                    </div>
                    <div>
                        <label for="telephone" class="block text-gray-700 m-2">Téléphone</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="telephone" id="telephone">
                    </div>
                    <button type="submit" class="bg-slate-500 w-[50%] text-white font-semibold px-4 py-2 rounded-full place-self-center">
                        Ajouter
                    </button>
                </form>
            `;

            divMere.appendChild(ajoutClient);

            //  Fermer le popup
            ajoutClient.querySelector("#closeBtn").addEventListener("click", function () {
                divMere.removeChild(ajoutClient);
            });

            //  Gestion de l'ajout d'un client
            form= ajoutClient.querySelector("#formClient")
           form.addEventListener("submit", function (event) {
                event.preventDefault();

                let photoInput = ajoutClient.querySelector("#image");
                let photoUrl = "";

                if (photoInput.files.length > 0) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        photoUrl = e.target.result;
                        ajouterNouveauClient(photoUrl);
                    };
                    reader.readAsDataURL(photoInput.files[0]);
                } else {
                    ajouterNouveauClient("");
                }

                function ajouterNouveauClient(photoUrl) {
                    let nouveauClient = {
                        photo: photoUrl,
                        nom: ajoutClient.querySelector("#nom").value,
                        prenom: ajoutClient.querySelector("#prenom").value,
                        email: ajoutClient.querySelector("#mail").value,
                        montant: parseFloat(ajoutClient.querySelector("#solde").value),
                        telephone: ajoutClient.querySelector("#telephone").value,
                        transactions: []
                    };

                    // Récupérer les clients existants depuis localStorage
                    let clients = JSON.parse(localStorage.getItem("tabJson")) || [];
                    clients.push(nouveauClient);

                    // Sauvegarder la nouvelle liste dans localStorage
                    localStorage.setItem("tabJson", JSON.stringify(clients));
                    // raffraichir
                    afficherDetails(nouveauClient);
                    // fermer popup après ajout
                    divMere.removeChild(ajoutClient);
                }
            });
        }

        //  Associer le bouton d'ajout
        document.getElementById('ajout').onclick = ajout_client;

    } catch (error) {
        console.error("Erreur lors du chargement des données JSON:", error);
    }
}

// 📌 Charger les données après le chargement de la page
document.addEventListener("DOMContentLoaded", afficherClient);

// affichage de données
// async function afficherClient() {
//     try { 
//          // chargement du tableau json
//         const reponse = await fetch("tableau.json");
//         const tabJson = await reponse.json();
        
//         // Sauvegarder las données dans le localStorage
//         localStorage.setItem("tabJson", JSON.stringify(client));

//             // Vérifier si les données existent dans localStorage
//         const donneStok = localStorage.getItem("tabJson");
//         if (donneStok) {
//             const clients = JSON.parse(donneStok);
//             console.log("Données récupérées :", clients);
//         } else {
//             console.log("Aucune donnée trouvée !");
//         }
//         let index = 0; // Index du client affiché
//         let client = clients[index]; 

//         function afficherDetails(client) {

//             document.getElementById("photoProfil").innerHTML = `
//                     <img src="${client.photo}" alt="Photo de ${client.nom}" class="w-32 h-32 rounded-full">
//                 `;
//                 document.getElementById("nomClient").innerText = `Bonjour ${client.prenom}.${client.nom} 😍`;
                
//                 // Afficher les informations (Téléphone, Email, Montant)
//                 document.getElementById("telClient").innerText = `Téléphone: ${client.telephone}`;
//                 document.getElementById("mailClient").innerText = `Email: ${client.email}`;
//                 document.getElementById("soldeClient").innerText = `Montant: ${client.montant} FCFA`;

//                  // Afficher la liste des transactions
//                  let transactionHTML = "";
//                  client.transactions.forEach(tr => {
//                     transactionHTML += `
//                         <tr class="odd:bg-white even:bg-slate-100 cursor-pointer hover:bg-slate-200">
//                             <td class="p-2">${tr.date}</td>
//                             <td class="p-2">${tr.numero}</td>
//                             <td class="p-2">${tr.type}</td>
//                             <td class="p-2 font-semibold ${tr.montant < 0 ? 'text-red-500' : 'text-green-500'}">
//                                 ${tr.montant} €
//                             </td>
//                         </tr>
//                     `;
//                 });
//                 document.getElementById("transactionsTable").innerHTML = transactionHTML;
//         }
//         // Afficher le premier client au chargement
//         afficherDetails(client);
//         // bouton precedent
//         precedent=document.getElementById("precedent");
//         precedent.addEventListener("click", () => {
//             if (index > 0) {
//                 index--;
//                 afficherDetails(clients[index]);
//             }
//         });
//         // bouton suivant
//         suivant=document.getElementById("suivant")
//         suivant.addEventListener("click", () => {
//             if (index < clients.length - 1) {
//                 index++;
//                 afficherDetails(clients[index]);
//             }
//         });

//         // pour le popup de l'ajout client
//     function ajout_client() {
//     let ajoutClient=document.createElement("div");
//     let divMere=document.getElementById("mere")
//     ajoutClient.className="order-1 col-span-3 grid grid-cols-1 gap-1  bg-white rounded-xl shadow-lg max-h-[650px] ";
//     ajoutClient.innerHTML=`
//                 <form method="POST" id='formClient' class="w-full grid grid-cols-1 gap-1 p-3">
//                <button id="closeBtn" class="place-self-end  text-start text-2xl  text-slate-700"><i class="ri-close-circle-line"></i></button> 
//                 <p class="text-2xl font-semibold text-center mt-4">Ajouter un(e) client(e)</p>
//                 <div class="">
//                     <label for="image" class="block text-gray-700 m-2">Insérez une photo</label>
//                     <input type="file"
//                         class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
//                         name="image" id="image" aria-describedby="emailHelp">
//                     <div class="mt-1 text-red-500 text-sm  peer-invalid:block"></div>
//                 </div>
//                 <div class="">
//                     <label for="nom" class="block text-gray-700 m-2">Nom</label>
//                     <input type="text"
//                         class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
//                         name="nom" id="nom" aria-describedby="emailHelp">
//                     <div class="mt-1 text-red-500 text-sm  peer-invalid:block"></div>
//                 </div>
//                 <div class="">
//                     <label for="prenom" class="block text-gray-700 m-2">Prénom</label>
//                     <input type="text"
//                         class="peer border border-gray-300 rounded-full p-2  h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
//                         name="prenom" id="prenom" aria-describedby="emailHelp">
//                     <div class="mt-1 text-red-500 text-sm  peer-invalid:block"></div>
//                 </div>
//                 <div class="">
//                     <label for="mail" class="block text-gray-700 m-2">Email</label>
//                     <input type="text"
//                         class="peer border border-gray-300 rounded-full p-2  h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
//                         name="mail" id="mail" aria-describedby="emailHelp">
//                     <div class="mt-1 text-red-500 text-sm  peer-invalid:block"></div>
//                 </div>
//                 <div class="">
//                     <label for="solde" class="block text-gray-700 m-2">Montant</label>
//                     <input type="text"
//                         class="peer border border-gray-300 rounded-full p-2   h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
//                         name="montant" id="montant" aria-describedby="emailHelp">
//                     <div class="mt-1 text-red-500 text-sm  peer-invalid:block"></div>
//                 </div>
//                 <div class="">
//                     <label for="telephone" class="block text-gray-700 m-2">Téléphone</label>
//                     <input type="text"
//                         class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2   focus:ring-slate-300"
//                         name="telephone" id="telephone" aria-describedby="emailHelp">
//                     <div class="mt-1 text-red-500 text-sm  peer-invalid:block"></div>
//                 </div>
//                 <button type="submit"
//                     class="bg-slate-500 w-[50%] text-white font-semibold px-4 py-2 rounded-full place-self-center"
//                     name="add">ajouter</button>
//             </form>

//     `;
    
//     divMere.appendChild(ajoutClient);
//     let fermer = ajoutClient.querySelector("#closeBtn");
//     fermer.addEventListener("click", function () {
//         divMere.removeChild(ajoutClient);
//     });

//     // Pour ajouter un client lors de la soumission
//     let forme=ajoutClient.getElementById("formClient");
//     forme.addEventListener("submit", function (event) {
//         event.preventDefault();
         
//         let inputPhoto=ajoutClient.getElementById("photo");
//         let photoUrl = "";

//         if (inputPhoto.files.length > 0) {
//              let reader = new FileReader();
//              reader.onload = function (e) {
//              photoUrl = e.target.result; // URL de l'image
//              ajouterNouveauClient(photoUrl); // Ajouter le client après la lecture de l'image
//             };
//             reader.readAsDataURL(inputPhoto.files[0]); // Lire le fichier
//         } else {
//                 ajouterNouveauClient(""); // Si pas d'image, ajouter avec une valeur vide
//         }

//         function ajouterNouveauClient(photoUrl) {
//         let nouveauClient = {
//             photo: photoUrl,
//             nom: ajoutClient.getElementById("nom").value,
//             prenom: ajoutClient.getElementById("prenom").value,
//             email: ajoutClient.getElementById("email").value,
//             montant: parseFloat(ajoutClient.getElementById("montant").value),
//             telephone: ajoutClient.getElementById("telephone").value,
//             transactions: []
//         };

//         clients.push(nouveauClient);
//         index = clients.length - 1;
//         afficherDetails(nouveauClient);
//         divMere.removeChild(ajoutClient);
//     }
//     });
// }
//     let ajout=document.getElementById('ajout')
//     ajout.onclick = ajout_client;
  
//      } catch (error) {
//         console.error("Erreur lors du chargement des données JSON:", error);
//          }
// }
// //Charger les données après le chargement de la page
// document.addEventListener("DOMContentLoaded", afficherClient);


// Pour le popup de l'ajout transaction
function ajoutTransaction() {
    let ajouTransaction=document.createElement("div");
    let transaction=document.getElementById("transaction")
    ajouTransaction.className="grid grid-cols-1 gap-1 col-span-3 order-2   bg-white rounded-xl shadow-lg   max-h-[500px]";
    ajouTransaction.innerHTML=`
                <form method="POST" class="w-full grid grid-cols-1 gap-1 p-3">
               <button id="closeBtn1" type="button" class=" place-self-end text-start text-2xl  text-slate-700"><i class="ri-close-circle-line"></i></button> 
                    <p class="text-2xl font-semibold text-center mt-4">Transaction</p>
                    <div class="">
                        <label for="nom" class="block text-gray-700 m-2">Date</label>
                        <input type="date"
                            class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
                            name="nom" id="" aria-describedby="emailHelp">
                        <div class="mt-1 text-red-500 text-sm  peer-invalid:block"></div>
                    </div>
                    <div class="mb-2">
                        <label for="prenom" class="block text-gray-700 m-2">Numéro</label>
                        <input type="text"
                            class="peer border border-gray-300 rounded-full p-2  h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
                            name="prenom" id="" aria-describedby="emailHelp">
                        <div class="mt-1 text-red-500 text-sm "></div>
                    </div>
                    <div class="">
                        <label for="transactionType" class="block text-gray-700">Type de transaction</label>
                        <select id="transactionType"
                            class="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300">
                            <option value="retrait">Choisissez</option>
                            <option value="retrait">Retrait</option>
                            <option value="depot">Dépôt</option>
                            <option value="transfert">Transfert</option>
                        </select>
                        <div id="error-type" class="mt-1 text-red-500 text-sm"></div>
                    </div>
                    <div class="mb-2">
                        <label for="telephone" class="block text-gray-700 m-2">Montant</label>
                        <input type="text"
                            class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2   focus:ring-slate-300"
                            name="telephone" id="" aria-describedby="emailHelp">
                        <div class="mt-1 text-red-500 text-sm "></div>
                    </div>
                    <button type="submit"
                        class="mb-2 bg-slate-500 w-[50%] text-white font-semibold px-4 py-2 rounded-full place-self-center"
                        name="add">ajouter</button>
                </form>
    `;
    
    transaction.appendChild(ajouTransaction);
    let close = ajouTransaction.querySelector("#closeBtn1");
    close.addEventListener("click", function () {
        transaction.removeChild(ajouTransaction);
    });
}
let ajouter=document.getElementById('addTransaction')
ajouter.onclick = ajoutTransaction;

