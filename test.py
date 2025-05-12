# import os
# import sys
# import json
# import inspect
# import subprocess
# import tempfile
# import importlib
# import pkgutil
# from typing import Dict, List, Any, Optional


# def install_package(package_name: str, version: Optional[str] = None) -> bool:
#     """Устанавливает пакет из PyPI во временное окружение."""
#     package_spec = package_name
#     if version:
#         package_spec = f"{package_name}=={version}"
    
#     print(f"Установка пакета {package_spec}...")
#     try:
#         subprocess.check_call([
#             sys.executable, "-m", "pip", "install", 
#             package_spec, "--quiet"
#         ])
#         return True
#     except subprocess.CalledProcessError as e:
#         print(f"Ошибка установки пакета: {e}")
#         return False


# def get_module_items(module_name: str) -> List[Dict[str, Any]]:
#     """Получает все элементы (функции, классы, константы) из модуля."""
#     try:
#         module = importlib.import_module(module_name)
#         items = []
        
#         # Получаем все объекты модуля
#         for name, obj in inspect.getmembers(module):
#             # Пропускаем приватные и "магические" элементы
#             if name.startswith('_'):
#                 continue
                
#             item_info = {
#                 "label": name,
#             }
            
#             # Определяем тип объекта
#             if inspect.isfunction(obj):
#                 item_info["type"] = "function"
                
#                 # Получаем документацию
#                 if obj.__doc__:
#                     item_info["detail"] = obj.__doc__.strip()
                
#                 # Получаем сигнатуру функции
#                 try:
#                     sig = inspect.signature(obj)
#                     item_info["info"] = str(sig)
#                 except (ValueError, TypeError):
#                     pass
                    
#             elif inspect.isclass(obj):
#                 item_info["type"] = "class"
#                 if obj.__doc__:
#                     item_info["detail"] = obj.__doc__.strip()
                    
#             elif inspect.ismodule(obj):
#                 item_info["type"] = "module"
#                 if obj.__doc__:
#                     item_info["detail"] = obj.__doc__.strip()
                    
#             else:
#                 item_info["type"] = "variable"
                
#             items.append(item_info)
            
#         return items
#     except ImportError as e:
#         print(f"Ошибка импорта модуля {module_name}: {e}")
#         return []
#     except Exception as e:
#         print(f"Ошибка при обработке модуля {module_name}: {e}")
#         return []


# def discover_submodules(package_name: str) -> List[str]:
#     """Находит все подмодули пакета."""
#     try:
#         package = importlib.import_module(package_name)
#         submodules = []
        
#         for loader, name, is_pkg in pkgutil.walk_packages(package.__path__, package.__name__ + '.'):
#             submodules.append(name)
            
#         return submodules
#     except (ImportError, AttributeError) as e:
#         print(f"Ошибка при поиске подмодулей {package_name}: {e}")
#         return []


# def generate_completions_json(package_name: str, output_file: str) -> None:
#     """Генерирует JSON с данными для автодополнения."""
#     # Установка пакета
#     if not install_package(package_name):
#         print(f"Не удалось установить пакет {package_name}")
#         return
    
#     # Получение основных функций/классов из корневого модуля
#     completions = get_module_items(package_name)
    
#     # Обнаружение и обработка подмодулей
#     submodules = discover_submodules(package_name)
#     for submodule in submodules:
#         submodule_items = get_module_items(submodule)
#         # Можно добавить информацию о подмодулях отдельно, если нужно
#         # или объединить все в один список
#         completions.extend(submodule_items)
    
#     # Сохранение результатов в JSON файл
#     with open(output_file, 'w', encoding='utf-8') as f:
#         json.dump([i for i in completions if i["type"] == "function"], f, indent=2)
    
#     print(f"Файл {output_file} успешно создан с {len(completions)} элементами")


# if __name__ == "__main__":
#     # Параметры можно передавать как аргументы командной строки
#     package_name = "controlhub"
#     if len(sys.argv) > 1:
#         package_name = sys.argv[1]
    
#     output_file = "controlhub_completions.json"
#     if len(sys.argv) > 2:
#         output_file = sys.argv[2]
    
#     generate_completions_json(package_name, output_file)

# from controlhub import press, write, fullscreen
# from time import sleep

# press(["win", "r"])
# write("cmd")
# press("enter")
# sleep(0.5)
# fullscreen(absolute=True)
# write("color 0a")
# press("enter")
# write("cd ../../../../../../..")
# press("enter")
# write("dir /s")
# press("enter")

# import os

# url = r"https://i.ytimg.com/vi/WLsUnyBswcc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDIWN3EvG3TNl5p7xtqVoWmeqJGkg"
# install_path = r"Default download path"
# os.environ["CH_DELAY"] = "0.8"

# from controlhub import download, open_file

# if install_path == "Default download path":
#     install_path = os.getenv("USERPROFILE") + r"\Downloads"

# print(f"Downloading from {url} to {install_path}...")
# file_path = download(url, install_path)
# print(f"Downloaded file: {file_path}")

# open_file(file_path)
# print(f"Opened file: {file_path}")

import os

def count_lines_chars(file_path):
    with open(file_path, "r") as f:
        data = f.read()
        return len(data), len(data.splitlines())

char_count = 0
line_count = 0
# 16 + 20 + 20 + 10
# 14 20 18 20
for root, dirs, files in os.walk(r".\src"):
    for file in files:
        if r"\lib\components\ui" not in os.path.join(root, file) and (file.endswith(".svelte") or file.endswith(".ts")):
            file_path = os.path.join(root, file)
            chars, lines = count_lines_chars(file_path)
            char_count += chars
            line_count += lines
            print(f"File: {file_path}, Lines: {lines}, Chars: {chars}")

print(f"Total lines: {line_count}, Total chars: {char_count}")