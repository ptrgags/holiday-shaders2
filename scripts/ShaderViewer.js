class ShaderViewer {
    constructor(material_manager) {
        this.scene = new THREE.Scene();
        this.material = material_manager;

        // These will be overwritten when we get a resize event
        this.width = 200;
        this.height = 200;

        // Subclasses must also define a `camera` field

        MESSENGER.subscribe('resize', (x) => this.resize(x));
    }

    resize(new_resolution) {
        // Update the size
        this.width = new_resolution.x;
        this.height = new_resolution.y;
    }

    on_new_frame() {
        this.material.on_new_frame();
    }
}

class ShaderViewer2D extends ShaderViewer {
    setup() {
        // Create a plane
        const SEGMENTS = 32;
        let plane_geom = new THREE.PlaneGeometry(1.0, 1.0, SEGMENTS, SEGMENTS);
        this.plane = new THREE.Mesh(plane_geom, this.material.material);
        this.plane.scale.set(this.width, this.height, 1.0);
        this.scene.add(this.plane);

        // Create an ortho camera
        const NEAR = 1;
        const FAR = 1000;
        const CAMERA_Z = 5.0;
        this.camera = new THREE.OrthographicCamera(
            //left
            -this.width / 2,
            //right
            this.width / 2,
            //top
            this.height / 2,
            //bottom
            -this.height / 2,
            NEAR,
            FAR
        )
        this.camera.position.z = CAMERA_Z;
    }

    resize(new_resolution) {
        super.resize(new_resolution);

        // Update the camera settings
        this.camera.aspect = this.width / this.height;
        this.camera.left = -this.width / 2;
        this.camera.right = this.width / 2;
        this.camera.top = this.height / 2;
        this.camera.bottom = -this.height / 2;
        this.camera.updateProjectionMatrix();

        //Also scale the plane to match the new resolution.
        this.plane.scale.set(this.width, this.height, 1.0);
    }

}


class ShaderViewer3D extends ShaderViewer {
    constructor(material_manager, model_selector) {
        super(material_manager);
        this.model_selector = model_selector;
    }

    setup() {
        // Set up the 3D models.
        this.model_selector.setup(this.material.material, this.scene);

        // Set up the camera
        const NEAR = 1;
        const FAR = 1000;
        const FOV = 45;
        this.camera = new THREE.PerspectiveCamera(
            FOV, this.width / this.height, NEAR, FAR);
        this.camera.position.set(0, 0, -5);
        this.camera.lookAt(0, 0, 0)
    }

    resize(new_resolution) {
        super.resize(new_resolution);

        // Update the camera settings
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    on_new_frame() {
        super.on_new_frame();
        let axis = new THREE.Vector3(0.0, 1.0, 0.0);

        // TODO: Add settings for 3D rotation!
        const ROTATION = 0.005;
        this.model_selector.model.rotateOnAxis(axis, ROTATION);
    }
}
