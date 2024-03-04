let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Declare the data variable at a global scope
let data;

// Load data from JSON
d3.json(url).then(function (jsonData) {
  data = jsonData;
  console.log(data);

  // Call the init function 
  init();
});

// Use D3 to select the dropdown menu
let dropdownMenu = d3.select("#selDataset");

// Call optionChanged when a change takes place to the DOM
dropdownMenu.on("change", optionChanged);

// Function to initialize the page with a default plot
function init() {
  // Populate the dropdown 
  data.names.forEach(individual => {
    dropdownMenu.append("option").attr("value", individual).text(individual);
  });

  // Initial default selected individual
  let defaultIndividual = data.names[0];

  // Call optionChanged with the default individual
  optionChanged(defaultIndividual);
}

function getWashingFrequency(id) {
    // The ? checks if id is definied before accessing wfreq.
    let washingFrequency = data.metadata.find(metadata => metadata.id === parseInt(id))?.wfreq;
    return washingFrequency;
}
// This function is called when a dropdown menu item is selected
function optionChanged(selectedIndividual) {
    // Retrieve the data for the selected individual from your samples.json
    let selectedData = data.samples.find(sample => sample.id === selectedIndividual);
  
    // Extract data for bar chart
    let top10OTUs = selectedData.otu_ids.slice(0, 10).reverse();
    let top10Values = selectedData.sample_values.slice(0, 10).reverse();
    let top10Labels = selectedData.otu_labels.slice(0, 10).reverse();
  
    // Create the horizontal bar chart
    let barTrace = {
      x: top10Values,
      y: top10OTUs.map(id => `OTU ${id}`),
      text: top10Labels,
      type: "bar",
      orientation: "h"
    };
  
    let barLayout = {
      title: `Top 10 OTUs for ${selectedIndividual}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
  
    // Update the correct div id ("bar")
    Plotly.newPlot("bar", [barTrace], barLayout);
  
    // Extract data for bubble chart
    let otuIds = selectedData.otu_ids;
    let sampleValues = selectedData.sample_values;
    let markerColors = otuIds;
    let textValues = selectedData.otu_labels;
  
    // Create the bubble chart
    let bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: textValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: markerColors,
        colorscale: 'Rainbow',
        opacity: 0.7
      }
    };
  
    let bubbleLayout = {
      title: `Bubble Chart for ${selectedIndividual}`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };
  
    // Update the correct div id ("bubble")
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
    
    // Extract the washing frequency for the selected individual
    let washingFrequency = getWashingFrequency(selectedData.wfreq);
  
    // Create the gauge chart
    let gaugeTrace = {
        type: "indicator",
        mode: "gauge+number",
        value: washingFrequency,
        title: {
            text: "<b>Belly Button Washing Frequency</b><br><span style='font-size: 14px;'>Scrubs per week</span>",
            font: { size: 18 }
        },
        gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            steps: [
                { range: [0, 1], color: "rgb(248, 243, 236)" },
                { range: [1, 2], color: "rgb(244, 241, 229)" },
                { range: [2, 3], color: "rgb(233, 230, 202)" },
                { range: [3, 4], color: "rgb(229, 231, 179)" },
                { range: [4, 5], color: "rgb(213, 228, 157)" },
                { range: [5, 6], color: "rgb(183, 204, 146)" },
                { range: [6, 7], color: "rgb(140, 191, 136)" },
                { range: [7, 8], color: "rgb(138, 187, 143)" },
                { range: [8, 9], color: "rgb(133, 180, 138)" },
              ],
            },

    }

    let gaugeLayout = {
        width: 400,
        height: 300,
        margin: { t: 0, b: 0 },
    };

    // Use Plotly.react to append the gauge chart to the existing chart
    Plotly.newPlot("gauge", [gaugeTrace], gaugeLayout);


    // Display sample metadata
    displaySampleMetadata(selectedIndividual);

  }


  function displaySampleMetadata(selectedIndividual) {
    // Select the sample-metadata div
    let sampleMetadataDiv = d3.select("#sample-metadata");

    // Clear any existing content
    sampleMetadataDiv.html("");

    // Retrieve the metadata for the selected individual
    let selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedIndividual));

    // Add this console.log statement to check if the metadata is being retrieved
    console.log("Selected Metadata:", selectedMetadata);

    // Display key-value pairs in the sample-metadata div
    Object.entries(selectedMetadata).forEach(([key, value]) => {
        // Check if the key is one of the specified ones
        if (['id', 'ethnicity', 'gender', 'age', 'location', 'bbtype', 'wfreq'].includes(key)) {
            sampleMetadataDiv.append("p").text(`${key}: ${value}`);
        }
    });
}
  
  