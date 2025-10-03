from gradio_client import Client, handle_file

client = Client("TheAstrophile-KingK/asset-mapping")
result = client.predict(
	input_image=handle_file('/Users/champakjyotikonwar/My_Projects/KushalBan/backend/output/fra_atlas/fra_polygon_20251003_215100.png'),
	api_name="/predict_image"
)
print(result)