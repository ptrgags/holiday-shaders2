class ShaderViewer {
    constructor(material_manager) {
        this.scene = new THREE.Scene();
        this.material = material_manager;

        // These will be overwritten when we get a resize event
        this.width = 200;
        this.height = 200;

        // Subclasses must also define a `camera` field
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
}


/*
class ShaderViewer3D extends ShaderViewer {

}
*/
