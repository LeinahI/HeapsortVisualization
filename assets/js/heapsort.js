let input_container_height = document.querySelector("#array");
let count_container_length = document.querySelector("#count");
let getArrayLengthSlider = document.querySelector("#getIndexLengthVal");
let startSortingButton = document.querySelector("#startSorting");
let restartSortingButton = document.querySelector("#restartSorting");
let rngArrayButton = document.querySelector("#rngArray");
const sortedNumbersContainer = document.querySelector("#sorted-numbers");
const alertPlaceholder = document.querySelector("#liveAlertPlaceholder");
let arrayLength = 20; // Default array length
let isSortingRestarted = false;
let isSortingCompleted = false;
let inputArrayValues = []; // Array to store inputArray values
restartSortingButton.disabled = true;
startSortingButton.disabled = false;
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]'); //enable bootstrap tooltip
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

getArrayLengthSlider.addEventListener('input', function rangeChange() {// get value of input slider
    this.setAttribute('value', this.value);
});

rngArrayButton.addEventListener("click", generateRandomArrayHeight);
function generateRandomArrayHeight() {
    inputArrayValues = []; // Clear previous inputArray values
    for (let i = 0; i < arrayLength; i++) {
        let randomValue = Math.floor(Math.random() * 100);
        inputArrayValues.push(randomValue);
    }
    inputArray(); // Update the array elements with random values
}

// Function to generate the array of blocks
function inputArray() {
    input_container_height.innerHTML = ""; // Clear previous array
    for (let i = 0; i < arrayLength; i++) {
        let array_ele = document.createElement("div"); // Creating element div
        array_ele.classList.add("block_height"); // Adding class 'block_height' to div

        let array_ele_input = document.createElement("input"); // Creating label element
        array_ele_input.classList.add("block_input");
        array_ele_input.setAttribute("type", "number");
        array_ele_input.setAttribute("min", "1");
        array_ele_input.setAttribute("max", "100");
        array_ele_input.value = inputArrayValues[i] || 1; // Retrieve the stored value or set default as 1

        array_ele_input.addEventListener("input", function () {// Event listener for input
            let value = array_ele_input.value;
            if (isNaN(value) || value === "") {
                value = 1; // Restore default value if empty or NaN
            } else if (value > 100) {
                value = 100;
            } else if (value < 1) {
                value = 1;
            }
            array_ele_input.value = value;
            array_ele.style.height = `${value * 3}px`; /* Height of .block */
            inputArrayValues[i] = value; // Update the stored value
        });

        let initialValue = array_ele_input.value; // Set initial height based on array_ele_label value
        array_ele.style.height = `${initialValue * 3}px`; /* Initial height of .block */
        array_ele.style.transform = `translateX(${i * 35.37}px)`; /* Width of .block and create gap */

        array_ele.appendChild(array_ele_input); // Appending created elements to index.html
        input_container_height.appendChild(array_ele);
    }
}

// Function to generate the indexes
function generateIndex() {
    count_container_length.innerHTML = ""; // Clear previous indexes
    for (let i = 0; i < arrayLength; i++) {
        let array_ele2 = document.createElement("div"); // Creating element div
        array_ele2.classList.add("block_legnth"); // Adding class 'block_legnth' to div

        array_ele2.style.height = `${25}px`; /* width of .block2 */
        array_ele2.style.transform = `translateX(${i * 35.37}px)`; /* Width of .block_legnth and create gap */

        let array_ele_label = document.createElement("label"); // create element label inside of block_length
        array_ele_label.classList.add("block_label"); // add class
        array_ele_label.innerText = i;

        array_ele2.appendChild(array_ele_label); // Appending created elements to index.html
        count_container_length.appendChild(array_ele2);
    }
}

// async Heapify function start
async function heapify(n, i) {
    let blocksHeight = document.querySelectorAll(".block_height");
    let root = i; // Initialize largest as root
    let left = 2 * i + 1; // left = 2 * i + 1
    let right = 2 * i + 2; // right = 2 * i + 2

    if (left < n && Number(blocksHeight[left].childNodes[0].value) > Number(blocksHeight[root].childNodes[0].value)) {
        root = left; // If left child is larger than root
    }

    if (right < n && Number(blocksHeight[right].childNodes[0].value) > Number(blocksHeight[root].childNodes[0].value)) {
        root = right; // If right child is larger than largest so far
    }

    if (root != i) { // If largest is not root
        let temp1 = blocksHeight[i].style.height;
        let temp2 = blocksHeight[i].childNodes[0].value;
        blocksHeight[i].style.height = blocksHeight[root].style.height;
        blocksHeight[root].style.height = temp1;

        blocksHeight[i].childNodes[0].value =
            blocksHeight[root].childNodes[0].value;
        blocksHeight[root].childNodes[0].value = temp2;

        await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, 250)
        );

        if (!isSortingRestarted) { // Recursively Heapify the affected sub-tree
            await new Promise((resolve) => setTimeout(resolve, 250));
            await heapify(n, root);
        }
    }
}
// async Heapify function end

// async HeapSort function start
async function heapSort(n) {
    let blocksHeight = document.querySelectorAll(".block_height");
    startSortingButton.disabled = true; // Disable the "Start Sorting" button
    getArrayLengthSlider.disabled = true; // Disable the "Set Length" button
    rngArrayButton.disabled = true;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) { // Build heap (rearrange array)
        if (!isSortingRestarted) {
            await heapify(n, i);
        }
        if (isSortingRestarted || isSortingCompleted) {
            return;
        }
    }

    let sortedNumbers = [];
    for (let i = n - 1; i > 0; i--) { // One by one extract an element from heap
        let temp1 = blocksHeight[i].style.height; // Move current root to end
        let temp2 = blocksHeight[i].childNodes[0].value;

        blocksHeight[i].style.height = blocksHeight[0].style.height;
        blocksHeight[0].style.height = temp1;
        blocksHeight[i].childNodes[0].value = blocksHeight[0].childNodes[0].value;
        blocksHeight[0].childNodes[0].value = temp2;

        sortedNumbers.unshift(blocksHeight[i].childNodes[0].value); //display sorted numbers
        sortedNumbersContainer.innerHTML = sortedNumbers
            .map((number) => `<div class="sorted-number">&nbsp;${number}</div>`)
            .join("");

        await new Promise((resolve) => setTimeout(resolve, 250));

        if (!isSortingRestarted) { // Call max Heapify on the reduced heap
            await heapify(i, 0);
        }
        if (isSortingRestarted || isSortingCompleted) {
            return;
        }
    }

    sortedNumbers.unshift(blocksHeight[0].childNodes[0].value); //initialize sorted numbers
    sortedNumbersContainer.innerHTML = sortedNumbers
        .map((number) => `<div class="sorted-number">&nbsp;${number}</div>`)
        .join("");

    isSortingCompleted = true;
    startSortingButton.disabled = false; // Enable the button after sorting completes
    getArrayLengthSlider.disabled = false; // Enable the "Set Length" button
    rngArrayButton.disabled = false; // Enable the rng button
    restartSortingButton.disabled = true; // Disable the "restart Sorting" button

    const appendAlert = (message) => { // Create Bootstrap alert when sorting is completed
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
            `<div class="alert alert-success alert-dismissible fade show" role="alert">`,
            `   <h3>${message}</h3>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
        ].join("");
        alertPlaceholder.append(wrapper);
        setTimeout(() => { // Close the alert after 5 seconds
            wrapper.remove();
        }, 5000);
    };
    appendAlert("Sorting Completed!");
    isSortingCompleted = false; //enable to start heapsort again
}
// async HeapSort function end

getArrayLengthSlider.addEventListener("input", function () { // Event listener for the "Set Length" Slider
    let inputValue = getArrayLengthSlider.value;
    arrayLength = inputValue;
    inputArray();
    generateIndex();
});

startSortingButton.addEventListener("click", function () { // Event listener for the "Start Sorting" button
    if (!isSortingCompleted) {
        restartSortingButton.disabled = false;
        startSortingButton.disabled = true;
        isSortingRestarted = false;
        heapSort(arrayLength);
    }
});

restartSortingButton.addEventListener("click", restartSorting);
function restartSorting() { // Function to restart the sorting process
    isSortingRestarted = true;
    startSortingButton.disabled = false;
    restartSortingButton.disabled = true;
    rngArrayButton.disabled = false;
    getArrayLengthSlider.disabled = false;
}

inputArray(); // Initial generation of array and indexes
generateIndex();