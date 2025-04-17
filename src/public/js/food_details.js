
        document.getElementById('food_name').addEventListener('keyup', function() {
            const query = this.value;
            console.log(query);

            if (query.length > 2) { // Only call API if input length is greater than 2
                console.log("calling sugg");
                axios.get(`/suggestions?q=${query}`) // Call the suggestions route
                    .then(response => {
                        const suggestions = response.data; // Assuming the response is an array of suggestions
                        console.log(suggestions);
                        const suggestionsContainer = document.getElementById('suggestions');
                        suggestionsContainer.innerHTML = ''; // Clear previous suggestions

                        if (suggestions.length > 0) {
                            suggestions.forEach(suggestion => {
                                const suggestionItem = document.createElement('div');
                                suggestionItem.textContent = suggestion; // Assuming suggestion is a string
                                suggestionItem.classList.add('suggestion-item');

                                // Add click event to select suggestion
                                suggestionItem.addEventListener('click', function() {
                                    document.getElementById('food_name').value = suggestion;
                                    suggestionsContainer.innerHTML = ''; // Clear suggestions
                                    suggestionsContainer.style.display = 'none'; // Hide dropdown
                                });

                                suggestionsContainer.appendChild(suggestionItem);
                            });
                            suggestionsContainer.style.display = 'block'; // Show dropdown
                        } else {
                            suggestionsContainer.innerHTML = '<p>No suggestions found.</p>';
                            suggestionsContainer.style.display = 'block'; // Show dropdown even if no suggestions
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching suggestions:', error);
                    });
            } else {
                document.getElementById('suggestions').innerHTML = ''; // Clear suggestions if input is too short
                document.getElementById('suggestions').style.display = 'none'; // Hide dropdown
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', function(event) {
            const suggestionsContainer = document.getElementById('suggestions');
            if (!document.getElementById('food_name').contains(event.target)) {
                suggestionsContainer.style.display = 'none'; // Hide dropdown
            }
        });