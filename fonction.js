async function afficherClient() {
    try {
        let donneStock = null;
        if(localStorage.getItem("client") == null) {
            const reponse = await fetch("tableau.json");
            const tabJson = await reponse.json();
            console.log("tabJson");

            // Sauvegarder les données dans le localStorage
            localStorage.setItem("client", JSON.stringify(tabJson));
            donneStock = localStorage.getItem("client");
        } else {
            donneStock = localStorage.getItem("client");
        
        }
        
        //  Vérifier si les données existent dans le localStorage
        donneStock = localStorage.getItem("client");
        console.log("donneStock");
        console.log(donneStock);
        if (!donneStock) {
            console.log("Aucune donnée trouvée !");
            return;
        }

        const clients = JSON.parse(donneStock);
        console.log("Données récupérées :", clients);
        

        let index = 0; // Index du client affiché
        let client = clients[index];
        console.log(client);

        function afficherDetails(client) {
            document.getElementById("photoProfil").innerHTML = `
                <img src="${client.photo}" alt="Photo de ${client.nom}" class="w-32 h-32 rounded-full">
            `;
            document.getElementById("nomClient").innerText = `Bonjour ${client.prenom} ${client.nom} 😍`;
            document.getElementById("telClient").innerText = `Téléphone: ${client.telephone}`;
            document.getElementById("mailClient").innerText = `Email: ${client.email}`;
            document.getElementById("soldeClient").innerText = `Montant: ${client.montant} FCFA`;

            // Afficher la liste des transactions
            let transactionHTML = "";
            client.transactions.forEach(tr => {
                transactionHTML += `
                    <tr class="odd:bg-white even:bg-slate-100 cursor-pointer hover:bg-slate-200">
                        <td class="p-2">${tr.date}</td>
                        <td class="p-2">${tr.numero}</td>
                        <td class="p-2">${tr.type}</td>
                        <td class="p-2 font-semibold ${tr.montant < 0 ? 'text-red-500' : 'text-green-500'}">
                            ${tr.montant} FCFA
                        </td>
                    </tr>
                `;
            });
            document.getElementById("transactionsTable").innerHTML = transactionHTML;
        }

        // Afficher le premier client au chargement
        afficherDetails(client);

        // Bouton précédent
        document.getElementById("precedent").addEventListener("click", () => {
            if (index > 0) {
                index--;
                afficherDetails(clients[index]);
            }
        });

        //  Bouton suivant
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
                        <div class="mt-1 text-red-500 text-sm  " id="error-photo"></div>
                    </div>
                    <div>
                        <label for="nom" class="block text-gray-700 m-2">Nom</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="nom" id="nom">
                        <div class="mt-1 text-red-500 text-sm  " id="error-nom"></div>
                    </div>
                    <div>
                        <label for="prenom" class="block text-gray-700 m-2">Prénom</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="prenom" id="prenom">
                        <div class="mt-1 text-red-500 text-sm  " id="error-prenom"></div>
                    </div>
                    <div>
                        <label for="mail" class="block text-gray-700 m-2">Email</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="mail" id="mail">
                        <div class="mt-1 text-red-500 text-sm  " id="error-mail"></div>
                    </div>
                    <div>
                        <label for="solde" class="block text-gray-700 m-2">Montant</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="montant" id="montant">
                        <div class="mt-1 text-red-500 text-sm  " id="error-montant"></div>
                    </div>
                    <div>
                        <label for="telephone" class="block text-gray-700 m-2">Téléphone</label>
                        <input type="text" class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300" name="telephone" id="telephone">
                        <div class="mt-1 text-red-500 text-sm  " id="error-tel"></div>
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

                    const num = [70, 75, 77, 78,76];

                    let photoInput = ajoutClient.querySelector("#image");
                    const nom=ajoutClient.querySelector("#nom").value;
                    const prenom= ajoutClient.querySelector("#prenom").value;
                    const email=ajoutClient.querySelector("#mail").value;
                    const montant=ajoutClient.querySelector("#montant").value;
                    const telephone=ajoutClient.querySelector("#telephone").value;

                    
                    let isValid=true;
            
                     let erreurPhoto=ajoutClient.querySelector("#error-photo")
                     erreurPhoto.textContent = "";
                   
                     let erreurNom = ajoutClient.querySelector("#error-nom")
                     erreurNom.textContent = "";
                   
                     let erreurPrenom = ajoutClient.querySelector("#error-prenom")
                     erreurPrenom.textContent = "";
                    
                     let erreurMail = ajoutClient.querySelector("#error-mail")
                     erreurMail.textContent = "";

                     let erreurMontant= ajoutClient.querySelector("#error-montant")
                     erreurMontant.textContent = "";

                     let erreurTel= ajoutClient.querySelector("#error-tel")
                     erreurTel.textContent = "";

                   
                     if (!telephone.trim()) {
                        erreurTel.textContent = "Le numéro de telephone  est requis.";
                         isValid = false;
                     } else if (!/^\d+$/.test(telephone)) {
                        erreurTel.textContent = "Veuillez entrer un numéro valide (chiffres uniquement).";
                        isValid=false;
                    } else if (telephone.length !=9) {
                         erreurTel.textContent = "Le numéro doit contenir exactement 9 chiffres.";
                         isValid = false;
                     } else if (!num.includes((parseInt(telephone.slice(0, 2))))) {
                       erreurTel.textContent = "Le numero devrait commencer par ces nombres (70,75, 76, 77, 78).";
                       isValid = false;
                   } 
                     if (!nom.trim()) {
                         erreurNom.textContent = "Nom obligatoire*.";
                         isValid = false;
                     }
                     if (!prenom.trim()) {
                        erreurPrenom.textContent = "Prénom obligatoire*.";
                        isValid = false;
                    }

                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!email.trim()) {
                        erreurMail.textContent = "Email obligatoire*.";
                        isValid = false;
                    } else if (!emailRegex.test(email)) {
                        erreurMail.textContent = "Veuillez entrer une adresse email valide.";
                        isValid = false;
                    }


                   
                     if (!montant.trim()) {
                         erreurMontant.textContent = "Veuillez saisir un montant.";
                         isValid = false;
                     } else if (!/^\d+$/.test(montant)) {
                        erreurMontant.textContent = "Veuillez entrer un montant valide (chiffres uniquement).";
                        isValid=false;
                    }  else if (montant<500) {
                        erreurMontant.textContent = "Le montant devrait etre supérieur ou égale à 500.";
                        isValid = false;
                    } 
                   
                   
                     if (!isValid) {
                        return;
                     }
            
                    let nouveauClient = {
                        id: Math.random().toString(36).substring(2, 10),
                        photo: photoUrl,
                        nom: ajoutClient.querySelector("#nom").value,
                        prenom: ajoutClient.querySelector("#prenom").value,
                        email: ajoutClient.querySelector("#mail").value,
                        montant: ajoutClient.querySelector("#montant").value,
                        telephone: ajoutClient.querySelector("#telephone").value,
                        transactions: []
                    };

                    // Récupérer les clients existants depuis localStorage
                    let clients = JSON.parse(localStorage.getItem("client")) || [];
                
                    clients.client.push(nouveauClient);
                    // Sauvegarder la nouvelle liste dans localStorage
                    localStorage.setItem("client", JSON.stringify(clients));
                    // raffraichir
                    afficherDetails(nouveauClient);
                    // fermer popup après ajout
                    divMere.removeChild(ajoutClient);
                }
            });
        }

        //  Associer le bouton d'ajout
        document.getElementById('ajout').onclick = ajout_client;

        // Pour le popup de l'ajout transaction
function ajoutTransaction() {
    let cli = clients[index];
    console.log(cli);
    let ajouTransaction=document.createElement("div");
    let transaction=document.getElementById("transaction")
    ajouTransaction.className="grid grid-cols-1 gap-1 col-span-3 order-2   bg-white rounded-xl shadow-lg   max-h-[500px]";
    ajouTransaction.innerHTML=`
                <form method="POST" id="formTransaction" class="w-full grid grid-cols-1 gap-1 p-3">
               <button id="closeBtn1" type="button" class=" place-self-end text-start text-2xl  text-slate-700"><i class="ri-close-circle-line"></i></button> 
                    <p class="text-2xl font-semibold text-center mt-4">Transaction</p>
                    <div class="">
                        <label for="nom" class="block text-gray-700 m-2">Date</label>
                        <input type="date"
                            class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
                            name="date" id="date" aria-describedby="emailHelp">
                        <div class="mt-1 text-red-500 text-sm  " id="error-date"></div>
                    </div>
                    <div class="mb-2">
                        <label for="prenom" class="block text-gray-700 m-2">Numéro</label>
                        <input type="text"
                            class="peer border border-gray-300 rounded-full p-2  h-8 w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
                            name="numero" id="numero" aria-describedby="emailHelp">
                        <div class="mt-1 text-red-500 text-sm " id="error-number"></div>
                    </div>
                    <div class="">
                        <label for="transactionType" class="block text-gray-700">Type de transaction</label>
                        <select id="type"
                            class="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300">
                            <option value="">Choisissez</option>
                            <option value="retrait">Retrait</option>
                            <option value="depot">Dépôt</option>
                            <option value="transfert">Transfert</option>
                        </select>
                        <div id="error-type" class="mt-1 text-red-500 text-sm" id="error-type"></div>
                    </div>
                    <div class="mb-2">
                        <label for="telephone" class="block text-gray-700 m-2">Montant</label>
                        <input type="text"
                            class="peer border border-gray-300 rounded-full p-2 h-8 w-full focus:outline-none focus:ring-2   focus:ring-slate-300"
                            name="solde" id="solde" aria-describedby="emailHelp">
                        <div class="mt-1 text-red-500 text-sm " id="error-montant"></div>
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

    forme= ajouTransaction.querySelector("#formTransaction")
    forme.addEventListener("submit", function (event) {
        let transaction=document.getElementById("transaction")

         event.preventDefault();
          
         const num = [70, 75, 77, 78,76];

        const date= ajouTransaction.querySelector("#date").value;
        const numero=ajouTransaction.querySelector("#numero").value;
        const type=ajouTransaction.querySelector("#type").value;
        const montant= ajouTransaction.querySelector("#solde").value;
        
        let isValid=true;

         let erreurDate=ajouTransaction.querySelector("#error-date")
         erreurDate.textContent = "";
       
         let erreurNumber = ajouTransaction.querySelector("#error-number")
         erreurNumber.textContent = "";
       
         let erreurType = ajouTransaction.querySelector("#error-type")
         erreurType.textContent = "";
       
         let erreurMontant= ajouTransaction.querySelector("#error-montant")
         erreurMontant.textContent = "";
       
       
         if (!date.trim()) {
             erreurDate.textContent = "Saisissez une date.";
             erreurDate.classList.add("!text-red-500")
             isValid = false;
         }
       
         if (!numero.trim()) {
            erreurNumber.textContent = "Le numero  est obligatoire.";
             isValid = false;
         } else if (numero.length !=9) {
             erreurNumber.textContent = "Le numéro doit contenir exactement 9 chiffres.";
             isValid = false;
         } else if (!num.includes((parseInt(numero.slice(0, 2))))) {
           erreurNumber.textContent = "Le numero devrait commencer par ces nombres (70,75, 76, 77, 78).";
           isValid = false;
       } 
         if (!type.trim()) {
             erreurType.textContent = "Veuillez sélectionnez le type de transaction.";
             isValid = false;
         }
       
         if (!montant.trim()) {
             erreurMontant.textContent = "Veuillez saisir un montant.";
             isValid = false;
         } else if (!/^\d+$/.test(montant)) {
            erreurMontant.textContent = "Veuillez entrer un montant valide (chiffres uniquement).";
            isValid=false;
        } else if (montant<500) {
            erreurMontant.textContent = "Le montant devrait etre supérieur ou égale à 500.";
            isValid = false;
        } else if (montant>cli.montant) {
            if (type=='retrait' || type=='transfert') {
             erreurMontant.textContent = "Le montant est insuffisant.";
            isValid = false; 
            }
           
        }
       
       
         if (!isValid) {
            return;
            //  event.preventDefault();
         }
         
            if (index !== -1) {
                // Vérifier si le client a déjà une liste de transactions
                if (!clients[index].transactions) {
                    clients[index].transactions = []; // Initialiser si nécessaire
                }

        let nouveauTransaction = {
            date: date,
            numero: numero,
            type: type,
            montant: montant,
        };

       
    
    // Ajouter la nouvelle transaction
    clients[index].transactions.push(nouveauTransaction);
    console.log(nouveauTransaction[type]);
    console.log(nouveauTransaction.type)

        if (nouveauTransaction.type=="retrait" || nouveauTransaction.type=="transfert") {
            clients[index].montant =parseInt(clients[index].montant) -parseInt(montant);
        } else{
            clients[index].montant= parseInt(clients[index].montant) + parseInt(montant); 
        }
         // Sauvegarder la nouvelle liste dans localStorage
         localStorage.setItem("client", JSON.stringify(clients));

            
        

        }
            // fermer popup après ajout
             transaction.removeChild(ajouTransaction);
             // raffraichir
             afficherDetails(cli);
     });
 }

let ajouter=document.getElementById('addTransaction')
ajouter.onclick = ajoutTransaction;


    } catch (error) {
        console.error("Erreur lors du chargement des données JSON:", error);
    }
}

//  Charger les données après le chargement de la page
document.addEventListener("DOMContentLoaded", afficherClient);


