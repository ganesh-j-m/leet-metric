document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = this.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username Should be Not Empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("invalid username")
        }
        return isMatching;
    }

    async function fetchuserDetails(username) {

        try {

            searchButton.textContent = "Searching....";
            searchButton.disabled = true;
            // const response = await fetch(URL);
            const proxyUrl = "https://api.allorigins.win/raw?url=";


            const targetUrl = "https://leetcode.com/graphql/";


            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");
            const graphql = JSON.stringify({
                query: "\n  query userSessionProgress($username: String!) {\n    allQuestionsCount {\n      difficulty\n      count\n    }\n    matchedUser(username: $username) {\n      submitStats {\n        acSubmissionNum {\n          difficulty\n          count\n          submissions\n        }\n        totalSubmissionNum {\n          difficulty\n          count\n          submissions\n        }\n      }\n    }\n  }\n",

                variables: { "username": `${username}` }
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            };

            const response = await fetch(proxyUrl + targetUrl, requestOptions);


            if (!response.ok) {
                throw new Error("enable to fetch the user details");
            }
            const parsedData = await response.json();
            console.log("loggin data: ", parsedData);
            displayUserData(parsedData);
        }
        catch (error) {
            statsContainer.innerHTML = `<p>No data found</p>`
        }
        finally {
            searchButton.textContent = "Searching....";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const totalQues = parsedData.data.allQuestionCounts[0].count;
        const totalEasyQues = parsedData.data.allQuestionCounts[1].count;
        const totalMediumQues = parsedData.data.allQuestionCounts[2].count;
        const totalHardQues = parsedData.data.allQuestionCounts[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acsubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acsubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acsubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acsubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);
    }


    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        console.log("loggin username: ", username);
        if (validateUsername(username)) {
            fetchuserDetails(username);

        }

    })

})