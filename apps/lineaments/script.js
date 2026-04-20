let tempLine = null;
let map = null;
let lineLayers = [];
let lineamentsArray = [];
let segmentsArray = [];
let lastPointLat = -999;
let lastPointLon = -999;
let currentZone = -999;
let currentHemispher = -999;

// Inicializar mapa con ESRI
function initializeMap() {
    map = L.map('map').setView([-32, -69], 10);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    }).addTo(map);

    // Variables de control de mouse
    let isMouseDown = false;
    let mouseMoved = false;

    // Eventos de mouse
    map.on('mousedown', function(e) {
        isMouseDown = true;
        mouseMoved = false;
    });

    map.on('mousemove', function(e) {
        if (isMouseDown) {
            mouseMoved = true;
        }
        if (!isMouseDown && e.latlng) {
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

    map.on('mouseup', function(e) {
        isMouseDown = false;
    });

    map.on('click', function(e) {
        if (!mouseMoved && e.latlng) {
            const { lat, lng } = e.latlng;
            addSegment(lat, lng);
            drawAllLineaments();
        }
    });

    map.on('contextmenu', function(e) {
        e.originalEvent.preventDefault();
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
            segmentsArray = [];
            lastPointLat = -999;
            lastPointLon = -999;
            drawAllLineaments();
        }
    });

    // Botones
    document.getElementById("undoButton").addEventListener("click", undo_command);
    document.getElementById("deleteLineamentButton").addEventListener("click", deleteLineamente_command);
    document.getElementById("copyStrikeDipButton").addEventListener("click", copyStrikeLength);
    document.getElementById("exportKLM_Button").addEventListener("click", saveToKML);
    document.getElementById("saveSVG").addEventListener("click", saveSVG);
    document.getElementById("downloadButton").addEventListener("click", function(e) {
        e.preventDefault();
        downloadStereoFile();
    });

    // Cargar KML
    document.getElementById("kmlFileInput").addEventListener("change", function(e) {
        if (e.target.files.length > 0) {
            loadKML(e.target.files[0]);
        }
    });
}


// Funciones de dibujo
function drawLineYellow(lat1, lng1, lat2, lng2) {
    const line = L.polyline([[lat1, lng1], [lat2, lng2]], {
        color: '#FFD700',
        weight: 3,
        opacity: 0.8
    }).addTo(map);
    lineLayers.push(line);
}

function drawLineBlue(lat1, lng1, lat2, lng2) {
    const line = L.polyline([[lat1, lng1], [lat2, lng2]], {
        color: '#1E90FF',
        weight: 3,
        opacity: 0.8
    }).addTo(map);
    lineLayers.push(line);
}

function drawTempLine(lat1, lng1, lat2, lng2) {
    if (tempLine) map.removeLayer(tempLine);
    tempLine = L.polyline([[lat1, lng1], [lat2, lng2]], {
        color: '#FFA500',
        weight: 2,
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
            lon2: longitude 
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
        drawLineYellow(seg.lat1, seg.lon1, seg.lat2, seg.lon2);
    });

    lineamentsArray.forEach(line => {
        line.forEach(seg => {
            drawLineBlue(seg.lat1, seg.lon1, seg.lat2, seg.lon2);
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

// Función CORREGIDA para cargar KML
function loadKML(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parser = new DOMParser();
            const kml = parser.parseFromString(e.target.result, "text/xml");
            const placemarks = kml.getElementsByTagName("Placemark");
            
            lineamentsArray = []; // Resetear array
            
            Array.from(placemarks).forEach(placemark => {
                const lineString = placemark.getElementsByTagName("LineString")[0];
                if (lineString) {
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
                            lon2: lon2
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

// Función CORREGIDA para copiar azimut/largo
function copyStrikeLength() {
    if (lineamentsArray.length === 0) {
        alert("No hay lineamientos para copiar");
        return;
    }

    let textToCopy = "Azimuth\tLength\n";
    
    lineamentsArray.forEach(line => {
        line.forEach(segment => {
            const data = calculateAzimuthLargo(segment.lat1, segment.lon1, segment.lat2, segment.lon2);
            // Solo añadir si no son los valores por defecto (90, 0)
            if (Math.abs(data.largo) > 0.1) {
                textToCopy += `${data.azimuth.toFixed(2)}\t${data.largo.toFixed(2)}\n`;
            }
        });
    });
    
    copyText(textToCopy);
}

// Funciones de exportación
function saveToKML() {
    if (lineamentsArray.length === 0) {
        alert("No hay lineamientos para exportar");
        return;
    }

    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>Lineamientos</name>`;

    lineamentsArray.forEach((line, index) => {
        kmlContent += `
        <Placemark>
            <name>Lineamiento ${index + 1}</name>
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

    downloadFile('lineamientos.kml', kmlContent, 'application/vnd.google-earth.kml+xml');
}

function saveSVG() {
    if (lineamentsArray.length === 0) {
        alert("No hay lineamientos para exportar");
        return;
    }

    const width = 800;
    const height = 600;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let svgPaths = "";

    lineamentsArray.forEach(line => {
        let pathData = "";
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

        svgPaths += `<path d="${pathData}" stroke="black" fill="none" stroke-width="0.5"/>\n`;
    });

    const svgContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${width}px" height="${height}px" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" 
     xmlns="http://www.w3.org/2000/svg" version="1.1">
    ${svgPaths}
</svg>`;

    downloadFile('lineamientos.svg', svgContent, 'image/svg+xml');
}

function downloadStereoFile() {
    if (lineamentsArray.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    let content = "Nombre;Azimut;Inclinacion;TipoDato;TipoAzimut;R;G;B;Grosor;EstriaAzi;EstriaIncli;EstriaMov;EstriaRke;Peso\n";
    
    lineamentsArray.forEach(line => {
        line.forEach(segment => {
            const { azimuth, largo } = calculateAzimuthLargo(segment.lat1, segment.lon1, segment.lat2, segment.lon2);
            content += `lineament;${azimuth.toFixed(0)};90;P;0;0;128;0;2;0;0;;0;${largo.toFixed(0)}\n`;
        });
    });

    downloadFile('lineamientos_estereo.csv', content, 'text/csv;charset=utf-8;');
}

// Función auxiliar para descargas
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

// Funciones de cálculos
function calculateAzimuthLargo(lat1, lon1, lat2, lon2) {
    let xy1 = convertToUTM(lat1, lon1);
    let xy2 = convertToUTM(lat2, lon2);
    const deltaX = xy2.x - xy1.x;
    const deltaY = xy2.y - xy1.y;

    let azimuth = 0;

    if (deltaX >= 0 && deltaY < 0) {
        azimuth = 90 + (Math.atan2(Math.abs(deltaY), Math.abs(deltaX)) * 180 / Math.PI);
    } else if (deltaX < 0 && deltaY < 0) {
        azimuth = 270 - (Math.atan2(Math.abs(deltaY), Math.abs(deltaX)) * 180 / Math.PI);
    } else if (deltaX < 0 && deltaY >= 0) {
        azimuth = 270 + (Math.atan2(Math.abs(deltaY), Math.abs(deltaX)) * 180 / Math.PI);
    } else {
        azimuth = 90 - (Math.atan2(Math.abs(deltaY), Math.abs(deltaX)) * 180 / Math.PI);
    }

    if (azimuth < 0) azimuth += 360;
    if (azimuth > 360) azimuth -= 360;

    let largo = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    return { azimuth: azimuth, largo: largo };
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

function copyText(textToCopy) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    tempTextArea.style.position = 'fixed';
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    try {
        document.execCommand('copy');
        alert('Copiado al portapapeles');
    } catch (err) {
        console.error('Error al copiar:', err);
    }
    document.body.removeChild(tempTextArea);
}

// Inicializar
window.onload = initializeMap;