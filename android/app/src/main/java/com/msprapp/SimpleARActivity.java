public class SimpleARActivity extends AppCompatActivity {
    private ModelRenderable modelRenderable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_simple_ar);

        ArFragment arFragment = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.arFragment);

        ModelRenderable.builder()
            .setSource(this, RenderableSource.builder().setSource(
                    this, 
                    Uri.parse("file:///android_asset/cube.glb"),  // Use the path of your model file
                    RenderableSource.SourceType.GLTF2)
                    .setScale(0.5f)  // Scale the original model to 50%
                    .setRecenterMode(RenderableSource.RecenterMode.ROOT)
                    .build()
            )
            .setRegistryId("cube.glb")
            .build()
            .thenAccept(renderable -> modelRenderable = renderable)
            .exceptionally(throwable -> {
                Toast.makeText(SimpleARActivity.this, "Unable to load model", Toast.LENGTH_LONG).show();
                return null;
            });

        arFragment.setOnTapArPlaneListener((hitResult, plane, motionEvent) -> {
            Anchor anchor = hitResult.createAnchor();
            AnchorNode anchorNode = new AnchorNode(anchor);
            anchorNode.setParent(arFragment.getArSceneView().getScene());
            createModel(anchorNode);
        });
    }

    private void createModel(AnchorNode anchorNode) {
        TransformableNode transformableNode = new TransformableNode(arFragment.getTransformationSystem());
        transformableNode.setParent(anchorNode);
        transformableNode.setRenderable(modelRenderable);
        transformableNode.select();
    }
}
