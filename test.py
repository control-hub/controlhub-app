import os
import sys
import json
import inspect
import subprocess
import tempfile
import importlib
import pkgutil
from typing import Dict, List, Any, Optional


def install_package(package_name: str, version: Optional[str] = None) -> bool:
    """Устанавливает пакет из PyPI во временное окружение."""
    package_spec = package_name
    if version:
        package_spec = f"{package_name}=={version}"
    
    print(f"Установка пакета {package_spec}...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", 
            package_spec, "--quiet"
        ])
        return True
    except subprocess.CalledProcessError as e:
        print(f"Ошибка установки пакета: {e}")
        return False


def get_module_items(module_name: str) -> List[Dict[str, Any]]:
    """Получает все элементы (функции, классы, константы) из модуля."""
    try:
        module = importlib.import_module(module_name)
        items = []
        
        # Получаем все объекты модуля
        for name, obj in inspect.getmembers(module):
            # Пропускаем приватные и "магические" элементы
            if name.startswith('_'):
                continue
                
            item_info = {
                "label": name,
            }
            
            # Определяем тип объекта
            if inspect.isfunction(obj):
                item_info["type"] = "function"
                
                # Получаем документацию
                if obj.__doc__:
                    item_info["detail"] = obj.__doc__.strip()
                
                # Получаем сигнатуру функции
                try:
                    sig = inspect.signature(obj)
                    item_info["info"] = str(sig)
                except (ValueError, TypeError):
                    pass
                    
            elif inspect.isclass(obj):
                item_info["type"] = "class"
                if obj.__doc__:
                    item_info["detail"] = obj.__doc__.strip()
                    
            elif inspect.ismodule(obj):
                item_info["type"] = "module"
                if obj.__doc__:
                    item_info["detail"] = obj.__doc__.strip()
                    
            else:
                item_info["type"] = "variable"
                
            items.append(item_info)
            
        return items
    except ImportError as e:
        print(f"Ошибка импорта модуля {module_name}: {e}")
        return []
    except Exception as e:
        print(f"Ошибка при обработке модуля {module_name}: {e}")
        return []


def discover_submodules(package_name: str) -> List[str]:
    """Находит все подмодули пакета."""
    try:
        package = importlib.import_module(package_name)
        submodules = []
        
        for loader, name, is_pkg in pkgutil.walk_packages(package.__path__, package.__name__ + '.'):
            submodules.append(name)
            
        return submodules
    except (ImportError, AttributeError) as e:
        print(f"Ошибка при поиске подмодулей {package_name}: {e}")
        return []


def generate_completions_json(package_name: str, output_file: str) -> None:
    """Генерирует JSON с данными для автодополнения."""
    # Установка пакета
    if not install_package(package_name):
        print(f"Не удалось установить пакет {package_name}")
        return
    
    # Получение основных функций/классов из корневого модуля
    completions = get_module_items(package_name)
    
    # Обнаружение и обработка подмодулей
    submodules = discover_submodules(package_name)
    for submodule in submodules:
        submodule_items = get_module_items(submodule)
        # Можно добавить информацию о подмодулях отдельно, если нужно
        # или объединить все в один список
        completions.extend(submodule_items)
    
    # Сохранение результатов в JSON файл
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(completions, f, indent=2)
    
    print(f"Файл {output_file} успешно создан с {len(completions)} элементами")


if __name__ == "__main__":
    # Параметры можно передавать как аргументы командной строки
    package_name = "controlhub"
    if len(sys.argv) > 1:
        package_name = sys.argv[1]
    
    output_file = "controlhub_completions.json"
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    generate_completions_json(package_name, output_file)
