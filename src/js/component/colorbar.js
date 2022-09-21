{ // Block Scope
    const footer = document.getElementById("footer");

    const color_bar = document.createElement("div");
    color_bar.setAttribute("class", "color_bar");
    footer.appendChild(color_bar);

    const colormap_instance = new colormap(4);
    const colormap_element = colormap_instance.draw(500, 50);
    color_bar.appendChild(colormap_element);
}