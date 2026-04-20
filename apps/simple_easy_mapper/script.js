let tempLine = null;
let map = null;
let lineLayers = [];
let lineamentsArray = [];
let segmentsArray = [];
let lastPointLat = -999;
let lastPointLon = -999;
let currentZone = -999;
let currentHemispher = -999;
let currentColor = '#f9eded';
let currentThickness = 2;
let isContinuousDrawing = false;
let isContinuousModeActive = false;
let isDeleteMode = false;

// Inicializar mapa con ESRI
function initializeMap() {
    map = L.map('map').setView([-32, -69], 10);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    }).addTo(map);

    // Configurar paleta de colores
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            currentColor = this.getAttribute('data-color');
        });
    });

    // Configurar paleta de grosores
    document.querySelectorAll('.thickness-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.thickness-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            currentThickness = parseInt(this.getAttribute('data-thickness'));
        });
    });

    // Variables de control de mouse
    let mouseMoved = false;

    // Eventos de mouse
    map.on('click', function(e) {
        if (isDeleteMode) {
            deleteNearestLineament(e.latlng);
            return;
        }

        if (isContinuousDrawing) {
            if (!isContinuousModeActive) {
                // Primer clic - activa modo continuo
                isContinuousModeActive = true;
                const { lat, lng } = e.latlng;
                addSegment(lat, lng);
                drawAllLineaments();
            } else {
                // Segundo clic - desactiva modo continuo
                isContinuousModeActive = false;
            }
        } else if (!mouseMoved && e.latlng) {
            // Modo normal - agregar punto
            const { lat, lng } = e.latlng;
            addSegment(lat, lng);
            drawAllLineaments();
        }
    });

    map.on('mousemove', function(e) {
        if (isContinuousDrawing && isContinuousModeActive && e.latlng) {
            const { lat, lng } = e.latlng;
            addSegment(lat, lng);
            drawAllLineaments();
        }
        
        if (e.latlng) {
            const { lat, lng } = e.latlng;
            
            document.getElementById('coordLat').textContent = lat.toFixed(6);
            document.getElementById('coordLng').textContent = lng.toFixed(6);
            
            const utmCoords = convertToUTM(lat, lng);
            document.getElementById("utmX").textContent = utmCoords.x.toFixed(2);
            document.getElementById("utmY").textContent = utmCoords.y.toFixed(2);
            document.getElementById("utmZone").textContent = utmCoords.zone;

            if (lastPointLat !== -999 && lastPointLon !== -999) {
                drawTempLine(lastPointLat, lastPointLon, lat, lng);
            }
        }
    });

    map.on('contextmenu', function(e) {
        e.originalEvent.preventDefault();
        isContinuousModeActive = false; // Desactivar modo continuo si estaba activo
        addLineament();
        drawAllLineaments();
    });

    // Eventos de teclado
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();
            undo_command();
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            isContinuousModeActive = false;
            isDeleteMode = false;
            updateDeleteModeUI();
            segmentsArray = [];
            lastPointLat = -999;
            lastPointLon = -999;
            drawAllLineaments();
        }
    });

    // Botones
    document.getElementById("undoButton").addEventListener("click", undo_command);
    document.getElementById("deleteLineamentButton").addEventListener("click", deleteLineamente_command);
    document.getElementById("exportKLM_Button").addEventListener("click", saveToKML);
    document.getElementById("saveSVG").addEventListener("click", saveSVG);
    document.getElementById("toggleDrawingMode").addEventListener("click", toggleDrawingMode);
    document.getElementById("deleteModeButton").addEventListener("click", toggleDeleteMode);

    // Cargar KML
    document.getElementById("kmlFileInput").addEventListener("change", function(e) {
        if (e.target.files.length > 0) {
            loadKML(e.target.files[0]);
        }
    });
}

// Funciones de dibujo
function drawLine(lat1, lng1, lat2, lng2, color, thickness) {
    const line = L.polyline([[lat1, lng1], [lat2, lng2]], {
        color: color,
        weight: thickness,
        opacity: 0.8
    }).addTo(map);
    lineLayers.push(line);
    return line;
}

function drawTempLine(lat1, lng1, lat2, lng2) {
    if (tempLine) map.removeLayer(tempLine);
    tempLine = L.polyline([[lat1, lng1], [lat2, lng2]], {
        color: currentColor,
        weight: currentThickness,
        dashArray: '5,5',
        opacity: 0.6
    }).addTo(map);
}

function clearMapLines() {
    lineLayers.forEach(layer => map.removeLayer(layer));
    lineLayers = [];
    if (tempLine) {
        map.removeLayer(tempLine);
        tempLine = null;
    }
}

// Funciones lógicas
function addSegment(latitude, longitude) {
    if (lastPointLat === -999 && lastPointLon === -999) {
        lastPointLat = latitude;
        lastPointLon = longitude;
    } else {
        segmentsArray.push({ 
            lat1: lastPointLat, 
            lon1: lastPointLon, 
            lat2: latitude, 
            lon2: longitude,
            color: currentColor,
            thickness: currentThickness
        });
        lastPointLat = latitude;
        lastPointLon = longitude;
    }
}

function addLineament() {
    if (segmentsArray.length > 0) {
        lineamentsArray.push([...segmentsArray]);
        segmentsArray = [];
        lastPointLat = -999;
        lastPointLon = -999;
    }
}

function drawAllLineaments() {
    clearMapLines();

    segmentsArray.forEach(seg => {
        drawLine(seg.lat1, seg.lon1, seg.lat2, seg.lon2, seg.color, seg.thickness);
    });

    lineamentsArray.forEach(line => {
        line.forEach(seg => {
            drawLine(seg.lat1, seg.lon1, seg.lat2, seg.lon2, seg.color, seg.thickness);
        });
    });
}

function undo_command() {
    segmentsArray.pop();
    if (segmentsArray.length > 0) {
        const lastSeg = segmentsArray[segmentsArray.length - 1];
        lastPointLat = lastSeg.lat2;
        lastPointLon = lastSeg.lon2;
    } else {
        lastPointLat = -999;
        lastPointLon = -999;
    }
    drawAllLineaments();
}

function deleteLineamente_command() {
    lineamentsArray.pop();
    drawAllLineaments();
}

function toggleDrawingMode() {
    isContinuousDrawing = !isContinuousDrawing;
    isContinuousModeActive = false;
    isDeleteMode = false;
    updateDeleteModeUI();
    
    const button = document.getElementById("toggleDrawingMode");
    if (isContinuousDrawing) {
        button.textContent = "Disable Continuous Drawing";
        button.style.backgroundColor = "#4CAF50";
    } else {
        button.textContent = "Enable Continuous Drawing";
        button.style.backgroundColor = "";
    }
}

function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    isContinuousModeActive = false;
    isContinuousDrawing = false;
    updateDeleteModeUI();
    
    // Actualizar también el botón de dibujo continuo
    const drawButton = document.getElementById("toggleDrawingMode");
    drawButton.textContent = "Enable Continuous Drawing";
    drawButton.style.backgroundColor = "";
}

function updateDeleteModeUI() {
    const button = document.getElementById("deleteModeButton");
    if (isDeleteMode) {
        button.classList.add("delete-mode");
        button.textContent = "Exit Delete Mode";
        map.getContainer().style.cursor = "pointer";
    } else {
        button.classList.remove("delete-mode");
        button.textContent = "Delete Line Mode";
        map.getContainer().style.cursor = "crosshair";
    }
}

function deleteNearestLineament(clickLatLng) {
    if (lineamentsArray.length === 0) return;

    let minDistance = Infinity;
    let nearestIndex = -1;

    lineamentsArray.forEach((lineament, index) => {
        lineament.forEach(segment => {
            // Calcular distancia al segmento
            const distanceToPoint1 = map.distance(clickLatLng, L.latLng(segment.lat1, segment.lon1));
            const distanceToPoint2 = map.distance(clickLatLng, L.latLng(segment.lat2, segment.lon2));
            const minSegmentDistance = Math.min(distanceToPoint1, distanceToPoint2);
            
            if (minSegmentDistance < minDistance) {
                minDistance = minSegmentDistance;
                nearestIndex = index;
            }
        });
    });

    if (nearestIndex !== -1) {
        lineamentsArray.splice(nearestIndex, 1);
        drawAllLineaments();
    }
}

// Función para cargar KML
function loadKML(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parser = new DOMParser();
            const kml = parser.parseFromString(e.target.result, "text/xml");
            const placemarks = kml.getElementsByTagName("Placemark");
            
            lineamentsArray = [];
            
            Array.from(placemarks).forEach(placemark => {
                const lineString = placemark.getElementsByTagName("LineString")[0];
                if (lineString) {
                    let lineColor = currentColor;
                    let lineThickness = currentThickness;
                    
                    const inlineStyle = placemark.getElementsByTagName("LineStyle")[0];
                    if (inlineStyle) {
                        const colorElement = inlineStyle.getElementsByTagName("color")[0];
                        const widthElement = inlineStyle.getElementsByTagName("width")[0];
                        
                        if (colorElement) lineColor = kmlColorToHex(colorElement.textContent);
                        if (widthElement) lineThickness = parseFloat(widthElement.textContent);
                    } else {
                        const styleUrl = placemark.getElementsByTagName("styleUrl")[0];
                        if (styleUrl) {
                            const styleId = styleUrl.textContent.replace('#', '');
                            const style = kml.querySelector(`Style[id="${styleId}"]`);
                            if (style) {
                                const lineStyle = style.getElementsByTagName("LineStyle")[0];
                                if (lineStyle) {
                                    const colorElement = lineStyle.getElementsByTagName("color")[0];
                                    const widthElement = lineStyle.getElementsByTagName("width")[0];
                                    
                                    if (colorElement) lineColor = kmlColorToHex(colorElement.textContent);
                                    if (widthElement) lineThickness = parseFloat(widthElement.textContent);
                                }
                            }
                        }
                    }

                    const coordsText = lineString.getElementsByTagName("coordinates")[0].textContent.trim();
                    const coords = coordsText.split(/\s+/).filter(c => c.trim() !== '');
                    
                    const lineSegments = [];
                    for (let i = 0; i < coords.length - 1; i++) {
                        const [lon1, lat1] = coords[i].split(',').map(Number);
                        const [lon2, lat2] = coords[i+1].split(',').map(Number);
                        
                        lineSegments.push({
                            lat1: lat1,
                            lon1: lon1,
                            lat2: lat2,
                            lon2: lon2,
                            color: lineColor,
                            thickness: lineThickness
                        });
                    }
                    
                    if (lineSegments.length > 0) {
                        lineamentsArray.push(lineSegments);
                    }
                }
            });
            
            drawAllLineaments();
            alert(`Cargados ${lineamentsArray.length} lineamientos desde KML`);
            
        } catch (error) {
            console.error("Error al procesar KML:", error);
            alert("Error al cargar el archivo KML. Asegúrate que es un KML válido.");
        }
    };
    reader.readAsText(file);
}

function kmlColorToHex(kmlColor) {
    if (!kmlColor || kmlColor.length < 8) return '#FF0000';
    const bbggrr = kmlColor.substr(2);
    const bb = bbggrr.substr(0, 2);
    const gg = bbggrr.substr(2, 2);
    const rr = bbggrr.substr(4, 2);
    return `#${rr}${gg}${bb}`;
}

function saveToKML() {
    if (lineamentsArray.length === 0) {
        alert("No hay lineamientos para exportar");
        return;
    }

    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>Polilíneas</name>
        <Style id="yellowLine">
            <LineStyle>
                <color>ff00ffff</color>
                <width>4</width>
            </LineStyle>
        </Style>`;

    lineamentsArray.forEach((line, index) => {
        const kmlColor = hexToKmlColor(line[0].color);
        const thickness = line[0].thickness;
        
        kmlContent += `
        <Style id="lineStyle${index}">
            <LineStyle>
                <color>${kmlColor}</color>
                <width>${thickness}</width>
            </LineStyle>
        </Style>
        <Placemark>
            <name>Polilínea ${index + 1}</name>
            <styleUrl>#lineStyle${index}</styleUrl>
            <LineString>
                <coordinates>`;
        
        line.forEach(segment => {
            kmlContent += `${segment.lon1},${segment.lat1},0 `;
        });
        if (line.length > 0) {
            const last = line[line.length - 1];
            kmlContent += `${last.lon2},${last.lat2},0`;
        }

        kmlContent += `
                </coordinates>
            </LineString>
        </Placemark>`;
    });

    kmlContent += `
    </Document>
</kml>`;

    downloadFile('polilineas.kml', kmlContent, 'application/vnd.google-earth.kml+xml');
}

function hexToKmlColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    return `ff${b.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${r.toString(16).padStart(2, '0')}`;
}

function saveSVG() {
    if (lineamentsArray.length === 0) {
        alert("No hay polilíneas para exportar");
        return;
    }

    const width = 800;
    const height = 600;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let svgPaths = "";

    lineamentsArray.forEach((line, index) => {
        let pathData = "";
        let currentColor = line[0].color;
        let currentThickness = line[0].thickness/5;
        
        line.forEach(segment => {
            const utm1 = convertToUTM(segment.lat1, segment.lon1);
            const utm2 = convertToUTM(segment.lat2, segment.lon2);
            
            const x1 = utm1.x / 1000;
            const y1 = -utm1.y / 1000;
            const x2 = utm2.x / 1000;
            const y2 = -utm2.y / 1000;

            if (pathData === "") {
                pathData += `M ${x1} ${y1} L ${x2} ${y2}`;
            } else {
                pathData += ` L ${x2} ${y2}`;
            }

            minX = Math.min(minX, x1, x2);
            minY = Math.min(minY, y1, y2);
            maxX = Math.max(maxX, x1, x2);
            maxY = Math.max(maxY, y1, y2);
        });

        svgPaths += `<path id="path${index}" d="${pathData}" stroke="${currentColor}" fill="none" stroke-width="${currentThickness}"/>\n`;
    });

    const margin = 10;
    minX -= margin;
    minY -= margin;
    maxX += margin;
    maxY += margin;

    const svgContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${width}px" height="${height}px" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" 
     xmlns="http://www.w3.org/2000/svg" version="1.1">
    <title>Polilíneas exportadas</title>
    <desc>Polilíneas generadas con la aplicación de mapeo</desc>
    ${svgPaths}
</svg>`;

    downloadFile('polilineas.svg', svgContent, 'image/svg+xml');
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

function convertToUTM(lat, lng) {
    const useFixedZone = document.getElementById("useFixedZone").checked;
    let zoneNumber, hemisphere;

    if (useFixedZone && currentZone !== -999) {
        zoneNumber = currentZone;
        hemisphere = currentHemispher;
    } else {
        zoneNumber = Math.floor((lng + 180) / 6) + 1;
        hemisphere = lat >= 0 ? 'north' : 'south';
        if (useFixedZone) {
            currentZone = zoneNumber;
            currentHemispher = hemisphere;
        }
    }

    const utmProj = `+proj=utm +zone=${zoneNumber} +${hemisphere === 'north' ? 'north' : 'south'} +datum=WGS84`;
    const [x, y] = proj4('EPSG:4326', utmProj, [lng, lat]);
    return { x, y, zone: `${zoneNumber}${hemisphere === 'north' ? 'N' : 'S'}` };
}

// Inicializar
window.onload = initializeMap;