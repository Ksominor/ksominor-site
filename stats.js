const API_LINK = "https://api.github.com/users/";

const API_PULLS = `https://api.github.com/repos/%user/%repo/pulls`
const API_COMMITS = "https://api.github.com/repos/%user/%repo/commits"
const API_BRANCHES = "https://api.github.com/repos/%user/%repo/branches"

const GITHUB = document.getElementById("github")

function parseRepositories(ownerName) {
    let repos = [];
    let repoLink = API_LINK + ownerName + "/repos";

    fetch(repoLink, { method: "GET" }).then(res => res.json())
        .then(res => { for (let i = 0; i < Math.min(res.length, 2); i++) repos.push(res[i]) })
        .then(() => {
            let first = true

            repos.forEach(rep => {
                let name = rep.name;
                let description = rep.description != null ? rep.description : "Для этого репозитория не предоставлено описания.. Но зато есть вкусная печенька --> 🍪";


                if (description.length > 90) {
                    description = description.substring(0, 77) + "..."
                }

                fetch(API_PULLS.replace("%user", ownerName).replace("%repo", name)).then(r => r.json()).then(p => {
                    fetch(API_COMMITS.replace("%user", ownerName).replace("%repo", name)).then(r => r.json()).then(c => {
                        fetch(API_BRANCHES.replace("%user", ownerName).replace("%repo", name)).then(r => r.json()).then(b => {
                            let link = `https://github.com/${ownerName}/${name}`;

                            if (first) {
                                GITHUB.innerHTML = "";
                                first = false
                            }

                            GITHUB.innerHTML +=
                                `
                                <a href="${link}"><div class="repo">
                                    <h2>${name}</h2>
                                    <p>${description}</p>

                                    <div class="stats">
                                        <span><i class="fa-solid fa-code-commit" style="color: #ffffff;"></i> ${c.length}</span>
                                        <span><i class="fa-solid fa-code-branch" style="color: #ffffff;"></i> ${b.length}</span>
                                        <span><i class="fa-solid fa-code-pull-request" style="color: #ffffff;"></i> ${p.length}</span>
                                    </div>
                                </div></a>
                                `;
                        })
                    })
                })
        });
    });
}

parseRepositories("Ksominor")
