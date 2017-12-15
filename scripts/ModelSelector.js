const GEOMETRIES = new Map([
    //BoxGeometry(w, h, d, w_segments, h_segments, d_segments)
    ['Cube', new THREE.BoxGeometry(2, 2, 2, 32, 32, 32)],
    //Torus(major_radius, minor_radius, major_segments, minor_segments)
    ['Torus', new THREE.TorusGeometry(1.0, 0.4, 16, 100)],
    //Cone(radius, height, radial_segments, height_segments)
    ['Cone', new THREE.ConeGeometry(1.4, 2, 32, 32)],
    //Sphere(radius, width_segments, height_segments)
    ['Sphere', new THREE.SphereGeometry(1.4, 32, 32)],
    //TorusKnot(radius, tube_diameter, tube_segments, radial_segments, p, q)
    //p, q must be co-prime
    ['Knot', new THREE.TorusKnotGeometry(0.9, 0.2, 100, 32, 5, 7)],
    //Icosahedron(radius)
    ['Icosahedron', new THREE.IcosahedronGeometry(1.5)]
]);

class ModelSelector {
    constructor() {
        this.models = new Map();
    }

    setup(material, scene) {
        let dropdown = $("#model-select");
        for (let id of GEOMETRIES.keys()) {
            $('<option>')
                .val(id)
                .html(id)
                .appendTo(dropdown);
        }

        this.make_models(material, scene);
        this.hide_all();
        this.show_model('Cube');

        $("#model-select").change(() => this.update_model());
    }

    make_models(material, scene) {
        for (var [id, geom] of GEOMETRIES) {
            let model = new THREE.Mesh(geom, material);
            this.models.set(id, model);
            scene.add(model);
        }
    }

    hide_all() {
        for (let model of this.models.values()) {
            model.visible = false;
        }
    }

    show_model(model_id) {
        this.models.get(model_id).visible = true;
    }

    get model_id() {
        return $("#model-select").find(":selected").val();
    }

    get model() {
        return this.models.get(this.model_id);
    }

    update_model() {
        this.hide_all();
        this.show_model(this.model_id);
    }
}
