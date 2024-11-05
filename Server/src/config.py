import pathlib

ML_MODELS: list[dict[str, str | dict | int]] = [
    {
        "name": "vgg-3",
        "description": "VGG model with 3 layers trained on CIFAR-10 dataset",
        "file": "vgg-3.h5",
        "preprocessing": {
            "resize": (32, 32),
            "normalize": 1 / 255.0
        },
        "classes": [
            "airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"
        ],
        "accuracy": 0.86,
        "version": '1'
    },
    {
        "name": "vgg-5",
        "description": "VGG model with 5 layers trained on CIFAR-100 dataset",
        "file": "vgg-5.h5",
        "preprocessing": {
            "resize": (32, 32),
            "normalize": 1 / 255.0
        },
        "classes": [
            'apple', 'aquarium_fish', 'baby', 'bear', 'beaver', 'bed', 'bee', 'beetle', 'bicycle', 'bottle',
            'bowl', 'boy', 'bridge', 'bus', 'butterfly', 'camel', 'can', 'castle', 'caterpillar', 'cattle',
            'chair', 'chimpanzee', 'clock', 'cloud', 'cockroach', 'couch', 'crab', 'crocodile', 'cup', 'dinosaur',
            'dolphin', 'elephant', 'flatfish', 'forest', 'fox', 'girl', 'hamster', 'house', 'kangaroo', 'keyboard',
            'lamp', 'lawn_mower', 'leopard', 'lion', 'lizard', 'lobster', 'man', 'maple_tree', 'motorcycle', 'mountain',
            'mouse', 'mushroom', 'oak_tree', 'orange', 'orchid', 'otter', 'palm_tree', 'pear', 'pickup_truck', 'pine_tree',
            'plain', 'plate', 'poppy', 'porcupine', 'possum', 'rabbit', 'raccoon', 'ray', 'road', 'rocket',
            'rose', 'sea', 'seal', 'shark', 'shrew', 'skunk', 'skyscraper', 'snail', 'snake', 'spider',
            'squirrel', 'streetcar', 'sunflower', 'sweet_pepper', 'table', 'tank', 'telephone', 'television', 'tiger', 'tractor',
            'train', 'trout', 'tulip', 'turtle', 'wardrobe', 'whale', 'willow_tree', 'wolf', 'woman', 'worm'
        ],
        "accuracy": 0.67,
        "version": '2'
    },
    {
        "name": "resnet-50",
        "description": "ResNet model with 50 layers trained on CIFAR-10 dataset",
        "file": "resnet.keras",
        "preprocessing": {
            "resize": (32, 32),
            "normalize": 1 / 255.0
        },
        "classes": [
            "airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"
        ],
        "accuracy": 0.895,
        "version": '1'
    },
]

DEFAULT_ML_MODEL = ML_MODELS[0]['name']

ML_MODELS_DIR = pathlib.Path('data/models')
IMAGE_DIR = pathlib.Path('data/images')

MAX_MESSAGE_SIZE = 10 * 1024 * 1024  # 10MB
