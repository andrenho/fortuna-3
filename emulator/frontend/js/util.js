// please provide:
//   - a tag with id 'error' where errors will be displayed on the page
async function loadComponents(...components) {
    const errorTag = document.getElementById('error');

    // load components
    const componentsHtml = [];
    for (let component of components) {
        try {
            const response = await fetch(`/components/${component}.html`);
            if (!response.ok) // or check for response.status
                throw new Error(response.statusText);
            componentsHtml.push(await response.text());
        } catch (error) {
            console.error(error);
            if (errorTag)
                errorTag.innerText = error;
        }
    }

    // add components to document
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = componentsHtml.join("\n");
    document.body.appendChild(div);

    // run components scripts
    for (const element of div.children)
        if (element.tagName.toUpperCase() === 'SCRIPT')
            eval(element.innerHTML);
}

